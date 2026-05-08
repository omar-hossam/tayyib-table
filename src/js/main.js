import Alpine from 'alpinejs'

Alpine.store('cart', {
  items: [],
  
  add(product) {
    const exisiting = this.items.find(p => p.id === product.id);
    if (exisiting) {
      exisiting.qty++
    } else {
      // qty -> stands for quantity
      this.items.push({ ...product, qty: 1 });
    }
    this.save()
  },
  
  remove(id) {
    this.items = this.items.filter(p => p.id !== id);
    this.save()
  },
  
  get total() {
    return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  },
  
  save() {
    localStorage.setItem('cart', JSON.stringify(this.items))
  },
  
  load() {
    const saved = localStorage.getItem('cart')
    if (saved) this.items = JSON.parse(saved);
  }
  
})

window.Alpine = Alpine;
Alpine.start();
Alpine.store('cart').load();
