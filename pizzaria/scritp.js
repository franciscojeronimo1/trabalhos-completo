const menu = document.getElementById("menu")
const bebidas = document.getElementById("bebidas")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const pizzaPrices = {
  calabresa: { pequena: 40, media: 45, grande: 50, familia: 65 },
  frango: { pequena: 40, media: 45, grande: 50, familia: 65 },
  portuguesatradicional: { pequena: 40, media: 45, grande: 50, familia: 65 },
  modadacasa: { pequena: 40, media: 45, grande: 50, familia: 65 },
  muçarela: { pequena: 40, media: 45, grande: 50, familia: 65 },
  portuguesacompleta: { pequena: 43, media: 48, grande: 55, familia: 70 },
  frangolino: { pequena: 43, media: 48, grande: 55, familia: 70 },
  canadense: { pequena: 43, media: 48, grande: 55, familia: 70 },
  brocoliscombacon: { pequena: 43, media: 48, grande: 55, familia: 70 },
  baconcompalmito: { pequena: 43, media: 48, grande: 55, familia: 70 },
  italiana: { pequena: 43, media: 48, grande: 55, familia: 70 },
  doisqueijos: { pequena: 43, media: 48, grande: 55, familia: 70 },
  tresqueijos: { pequena: 43, media: 48, grande: 55, familia: 70 },
  quatroqueijos: { pequena: 43, media: 48, grande: 55, familia: 70 },
  cincoqueijos: { pequena: 43, media: 48, grande: 55, familia: 70 },
  seisqueijos: { pequena: 43, media: 48, grande: 55, familia: 70 },
  costela: { pequena: 45, media: 55, grande: 70, familia: 85 },
  camarao: { pequena: 45, media: 55, grande: 70, familia: 85 },
  vegana: { pequena: 40, media: 45, grande: 50, familia: 65 },
  brocolis: { pequena: 40, media: 45, grande: 50, familia: 65 },
  napolitana: { pequena: 40, media: 45, grande: 50, familia: 65 },
  palmito: { pequena: 40, media: 45, grande: 50, familia: 65 }
};




let cart = [];

cartBtn.addEventListener("click", function () {
  updateCartModal()
  cartModal.style.display = "flex"
})

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none"
  }
})

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none"
})

bebidas.addEventListener("click", function (event) {

  let parentButton = event.target.closest(".add-to-cart-btn")

  if (parentButton) {
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))
    addToCart(name, price)

  }
})

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name)

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,

    })
  }

  updateCartModal()

}


function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-bold">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        <button class="remove-from-cart-btn bg-red-500 p-2 rounded" data-name="${item.name}">
          Remover
        </button>
      </div>
    `;

    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;
}



cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name")

    removeItemCart(name)
  }
})

function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name);

  if (index !== -1) {
    const item = cart[index]

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal()
      return
    }

    cart.splice(index, 1)
    updateCartModal()
  }
}


addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }
})

// finalizar pedido

checkoutBtn.addEventListener("click", function () {
  const cartItems = cart.map((item) => {
    return `${item.name} (Qtd: ${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2)}`;
  }).join("\n");

  /* if (!isOpen) {
    Toastify({
      text: "Ops o restaurante está fechado!",
      duration: 3000,
      close: true,
      gravity: "top", // top or bottom
      position: "right", // left, center or right
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast()
    return;
  } */

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return
  }
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  const paymentMethod = document.getElementById("payment-method").value;

  const message = encodeURIComponent(
    `*Pedido:*\n${cartItems}\n\n*Total: R$ ${total}*\n*Endereço:* ${addressInput.value}\n*Forma de Pagamento:* ${paymentMethod}`
  );



  const phone = "35999865637";
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  cart = [];
  updateCartModal();
});


function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 23;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if (isOpen) {
  spanItem.classList.remove("bg-red-500")
  spanItem.classList.add("bg-green-600")
} else {
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}

function sanitizeInput(input) {
  return input.replace(/[<>&"]/g, "");
}
const sanitizedAddress = sanitizeInput(addressInput.value);


document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && cartModal.style.display === "flex") {
    cartModal.style.display = "none";
  }
});


menu.addEventListener("click", function (event) {
  if (event.target.id === "add-pizza-btn") {
    const sabor1Select = document.getElementById("sabor-1");
    const sabor2Select = document.getElementById("sabor-2");
    const tamanhoSelect = document.getElementById("tamanho");
    const flavorWarn = document.getElementById("flavor-warn");

    const sabor1 = sabor1Select.value;
    const sabor2 = sabor2Select.value;
    const tamanho = tamanhoSelect.value;

    // Validação: ambos os sabores e o tamanho precisam ser selecionados
    if (!sabor1 || !sabor2 || !tamanho) {
      flavorWarn.classList.remove("hidden");
      return;
    } else {
      flavorWarn.classList.add("hidden");
    }

    // Obtém os preços dos dois sabores
    const price1 = pizzaPrices[sabor1][tamanho];
    const price2 = pizzaPrices[sabor2][tamanho];

    // Determina o preço mais alto entre os dois sabores
    const higherPrice = Math.max(price1, price2);

    // Adiciona a pizza ao carrinho
    addCart(`${sabor1} / ${sabor2} - ${tamanho}`, higherPrice);
  }
});




function addCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  updateCartModal();
}



