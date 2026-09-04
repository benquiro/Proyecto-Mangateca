// Raíz del proyecto derivada desde la ubicación de este módulo (src/components/)
const ROOT = new URL('../../', import.meta.url).href;

export function renderSimpleProductCard(item) {
    return `
    <a href="${ROOT}pages/product-detail.html?id=${item.id}" class="flex-none w-40 snap-start group cursor-pointer block">
        <article>
            <div class="overflow-hidden rounded-lg shadow-md relative">
                <img
                    src="${item.imageUrl}"
                    alt="Portada de ${item.title}"
                    class="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                >
            </div>
        </article>
    </a>
    `;
}

export function renderDetailedProductCard(item) {
    return `
    <a href="${ROOT}pages/product-detail.html?id=${item.id}" class="flex flex-col group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative">
        <!-- Favorite button -->
        <button class="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm" onclick="event.preventDefault(); /* add favorite logic here */" aria-label="Añadir a favoritos">
            <div class="w-5 h-5 bg-current transition-colors" style="mask: url('${ROOT}assets/icons/favorite.svg') no-repeat center / contain; -webkit-mask: url('${ROOT}assets/icons/favorite.svg') no-repeat center / contain;"></div>
        </button>

        <article class="flex flex-col h-full">
            <div class="overflow-hidden aspect-[2/3] relative bg-gray-100">
                <img
                    src="${item.imageUrl}"
                    alt="Portada de ${item.title}"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-4 flex flex-col flex-grow">
                <h3 class="font-bold text-gray-900 line-clamp-2 mb-1 text-sm sm:text-base" title="${item.title}">${item.title}</h3>
                <p class="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-1">${item.author}</p>
                <div class="mt-auto flex items-center justify-between">
                    <span class="font-extrabold text-indigo-600 text-lg">$${item.price.toFixed(2)}</span>
                    <button class="bg-indigo-50 text-indigo-600 p-2 rounded-full hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center" aria-label="Añadir al carrito" onclick="event.preventDefault(); /* add cart logic here */">
                        <img src="${ROOT}assets/icons/cart-add.svg" alt="Añadir" class="w-5 h-5">
                    </button>
                </div>
            </div>
        </article>
    </a>
    `;
}

export function renderFullProductDetail(item, categories = []) {
    const categoryTags = categories.map(cat =>
        `<span class="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">${cat.name}</span>`
    ).join('');

    return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        <!-- Contenedor de Imagen -->
        <div class="shadow-xl bg-gray-100 aspect-[2/3] max-w-md mx-auto w-full sticky top-8">
            <img
                src="${item.imageUrl}"
                alt="Portada completa de ${item.title}"
                class="w-full h-full object-cover"
            >
        </div>

        <!-- Información del Producto -->
        <div class="flex flex-col">
            <div class="flex flex-wrap gap-2 mb-4">
                ${categoryTags}
                <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">${item.type}</span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">${item.title}</h1>
            <p class="text-xl text-gray-500 font-medium mb-6">por <span class="text-indigo-600">${item.author}</span></p>

            <div class="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
                <span class="text-4xl font-extrabold text-gray-900 mr-2">$${item.price.toFixed(2)}</span>

                <button class="flex-1 bg-indigo-600 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center justify-center gap-3" onclick="/* add cart logic here */">
                    <img src="${ROOT}assets/icons/shopping-cart.svg" alt="Carrito" class="w-6 h-6 filter invert">
                    Añadir
                </button>

                <button class="bg-gray-50 text-gray-400 p-4 rounded-xl shadow-sm hover:bg-red-50 hover:text-red-500 transition-all border border-gray-200 flex items-center justify-center" onclick="/* add favorite logic here */" aria-label="Añadir a favoritos">
                    <div class="w-7 h-7 bg-current transition-colors" style="mask: url('${ROOT}assets/icons/favorite.svg') no-repeat center / contain; -webkit-mask: url('${ROOT}assets/icons/favorite.svg') no-repeat center / contain;"></div>
                </button>
            </div>

            <div class="mb-8">
                <h3 class="text-xl font-bold text-gray-900 mb-3">Sinopsis</h3>
                <p class="text-gray-700 leading-relaxed text-lg">${item.description}</p>
            </div>

            <div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Detalles</h3>
                <ul class="space-y-2 text-gray-600">
                    ${item.isbn ? `<li class="flex items-center"><strong class="w-32 text-gray-900">ISBN:</strong> <span>${item.isbn}</span></li>` : ''}
                    <li class="flex items-center"><strong class="w-32 text-gray-900">Publicación:</strong> <span>${item.publicationDate}</span></li>
                    <li class="flex items-center"><strong class="w-32 text-gray-900">Disponibilidad:</strong>
                        <span class="${item.available ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}">
                            ${item.available ? 'En Stock' : 'Agotado'}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `;
}
