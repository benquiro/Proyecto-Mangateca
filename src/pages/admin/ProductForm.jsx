import { useActionState, useState } from 'react'
import { CloseIcon } from '../../components/icons/index.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { SelectField, TextAreaField, TextField } from '../../components/ui/FormFields.jsx'
import { categories, PRODUCT_TYPES } from '../../data/catalog.js'
import { isValidUrl, validateProductFields } from '../../lib/validation.js'
import { useProductsStore } from '../../stores/productsStore.js'
import { toast } from '../../stores/toastStore.js'

const EMPTY_PRODUCT = {
  title: '',
  type: 'BOOK',
  author: '',
  description: '',
  isbn: '',
  publicationDate: '',
  categoryIds: [],
  price: '',
  available: true,
  imageUrl: '',
}

const TYPE_OPTIONS = Object.entries(PRODUCT_TYPES).map(([value, type]) => ({
  value,
  label: type.label,
}))

function readProduct(formData) {
  const text = (name) => String(formData.get(name) ?? '').trim()
  return {
    title: text('title'),
    type: text('type'),
    author: text('author'),
    description: text('description'),
    isbn: text('isbn').replace(/[-\s]/g, ''),
    publicationDate: text('publicationDate'),
    categoryIds: formData.getAll('categoryIds').map(Number),
    price: Math.round(Number(text('price')) * 100) / 100,
    available: formData.get('available') === 'on',
    imageUrl: text('imageUrl'),
  }
}

/** Formulario de alta/edición. Con `product` edita; sin él crea uno nuevo. */
export function ProductForm({ product, titleId, onDone }) {
  const addProduct = useProductsStore((state) => state.addProduct)
  const updateProduct = useProductsStore((state) => state.updateProduct)
  const [previewUrl, setPreviewUrl] = useState(product?.imageUrl ?? '')

  const [state, formAction, isPending] = useActionState(
    (_prevState, formData) => {
      const values = readProduct(formData)
      const errors = validateProductFields(values)
      // Los valores se devuelven para que el formulario no se vacíe al mostrar errores.
      if (Object.keys(errors).length > 0) return { values, errors }

      if (product) {
        updateProduct(product.id, values)
        toast(`«${values.title}» actualizado`)
      } else {
        addProduct(values)
        toast(`«${values.title}» creado`)
      }
      onDone()
      return { values, errors: {} }
    },
    { values: product ?? EMPTY_PRODUCT, errors: {} },
  )
  const { values, errors } = state

  return (
    <form action={formAction} noValidate>
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 id={titleId} className="text-lg font-semibold">
          {product ? 'Editar producto' : 'Nuevo producto'}
        </h2>
        <button
          type="button"
          onClick={onDone}
          aria-label="Cerrar"
          className="grid size-9 place-items-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
        <TextField
          label="Título"
          name="title"
          defaultValue={values.title}
          error={errors.title}
          className="sm:col-span-2"
        />
        <TextField label="Autor" name="author" defaultValue={values.author} error={errors.author} />
        <SelectField
          label="Tipo"
          name="type"
          defaultValue={values.type}
          error={errors.type}
          options={TYPE_OPTIONS}
        />
        <TextAreaField
          label="Sinopsis"
          name="description"
          defaultValue={values.description}
          error={errors.description}
          className="sm:col-span-2"
        />
        <TextField
          label="ISBN"
          name="isbn"
          inputMode="numeric"
          defaultValue={values.isbn}
          error={errors.isbn}
          hint="10 o 13 dígitos."
        />
        <TextField
          label="Fecha de publicación"
          name="publicationDate"
          type="date"
          defaultValue={values.publicationDate}
          error={errors.publicationDate}
        />
        <TextField
          label="Precio (USD)"
          name="price"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          defaultValue={values.price || ''}
          error={errors.price}
        />
        <div className="flex items-end pb-2.5">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="available"
              defaultChecked={values.available}
              className="size-4 rounded accent-brand-700"
            />
            Disponible para la venta
          </label>
        </div>

        <fieldset className="sm:col-span-2" aria-describedby={errors.categoryIds ? 'categories-error' : undefined}>
          <legend className="mb-2 text-sm font-medium text-gray-700">Categorías</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {categories.map((category) => (
              <label key={category.id} className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="categoryIds"
                  value={category.id}
                  defaultChecked={values.categoryIds.includes(category.id)}
                  className="size-4 rounded accent-brand-700"
                />
                {category.name}
              </label>
            ))}
          </div>
          {errors.categoryIds && (
            <p id="categories-error" className="mt-1.5 text-sm text-red-600">
              {errors.categoryIds}
            </p>
          )}
        </fieldset>

        <div className="flex gap-4 sm:col-span-2">
          <TextField
            label="URL de la portada"
            name="imageUrl"
            type="url"
            defaultValue={values.imageUrl}
            error={errors.imageUrl}
            onChange={(event) => setPreviewUrl(event.target.value.trim())}
            className="flex-1"
          />
          <div className="mt-7 aspect-[2/3] w-16 shrink-0 overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-200">
            {isValidUrl(previewUrl) && (
              <img
                src={previewUrl}
                alt="Vista previa de la portada"
                referrerPolicy="no-referrer"
                className="size-full object-cover"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {product ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </form>
  )
}
