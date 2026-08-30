export function renderSimpleProductCard(item) {
    return `
    <article class="flex-none w-40 snap-start group cursor-pointer">
        <div class="overflow-hidden rounded-lg shadow-md">
            <img
                src="${item.imageUrl}"
                alt="Portada de ${item.title}"
                class="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
            >
        </div>
    </article>
    `;
}

export function renderDetailedProductCard(item) {
    // Determine path based on current location (root vs inside pages/)
    const basePath = window.location.pathname.includes('/pages/') ? '../' : './';
    
    return `
    <article class="flex flex-col group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
                <button class="bg-indigo-50 text-indigo-600 p-2 rounded-full hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center" aria-label="Añadir al carrito">
                    <img src="${basePath}assets/icons/cart-add.svg" alt="Añadir" class="w-5 h-5">
                </button>
            </div>
        </div>
    </article>
    `;
}
