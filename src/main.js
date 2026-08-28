import { books } from "./products-db.js";
import { mangas } from "./products-db.js";
import { comics } from "./products-db.js";


function renderProductList(items, containerId) {
    const container = document.getElementById(containerId);

    const html = items
        .map(
            (item) => `
            <article class="flex-none w-40 snap-start group cursor-pointer">
                <div class="overflow-hidden rounded-lg shadow-md">
                    <img
                        src="${item.image}"
                        alt="Portada de ${item.title}"
                        class="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="eager"
                        decoding="async"
                    >
                </div>
            </article>
            `
        )
        .join("");

    container.insertAdjacentHTML("beforeend", html);
}

renderProductList(books, "book-list");
renderProductList(mangas, "manga-list");
renderProductList(comics, "comic-list");