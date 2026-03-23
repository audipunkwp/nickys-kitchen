import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, FlatList, Modal, TextInput, Alert } from 'react-native';

const menuItems = [
  { id: '1', name: 'Grilled Chicken', description: 'Juicy grilled chicken with herbs', price: 12.99, category: 'Main', image: require('./assets/images/IMG-20260303-WA0002.jpg') },
  { id: '2', name: 'Pasta Carbonara', description: 'Creamy pasta with bacon and eggs', price: 14.99, category: 'Main', image: require('./assets/images/IMG-20260303-WA0003.jpg') },
  { id: '3', name: 'Beef Steak', description: 'Premium beef steak with veggies', price: 24.99, category: 'Main', image: require('./assets/images/IMG-20260303-WA0004.jpg') },
  { id: '4', name: 'Fish & Chips', description: 'Crispy fish with golden chips', price: 13.99, category: 'Main', image: require('./assets/images/IMG-20260303-WA0005.jpg') },
  { id: '5', name: 'Caesar Salad', description: 'Fresh lettuce with caesar dressing', price: 8.99, category: 'Starter', image: require('./assets/images/IMG-20260303-WA0006.jpg') },
  { id: '6', name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 5.99, category: 'Starter', image: require('./assets/images/IMG-20260303-WA0007.jpg') },
  { id: '7', name: 'Bruschetta', description: 'Tomato on toasted bread', price: 6.99, category: 'Starter', image: require('./assets/images/IMG-20260303-WA0008.jpg') },
  { id: '8', name: 'Chocolate Cake', description: 'Rich chocolate layered cake', price: 7.99, category: 'Dessert', image: require('./assets/images/IMG-20260303-WA0009.jpg') },
  { id: '9', name: 'Ice Cream', description: 'Vanilla ice cream scoop', price: 4.99, category: 'Dessert', image: require('./assets/images/IMG-20260303-WA0010.jpg') },
  { id: '10', name: 'Tiramisu', description: 'Classic Italian dessert', price: 8.99, category: 'Dessert', image: require('./assets/images/IMG-20260303-WA0011.jpg') },
  { id: '11', name: 'Fresh Juice', description: 'Mixed fruit juice', price: 3.99, category: 'Drink', image: require('./assets/images/IMG-20260303-WA0012.jpg') },
  { id: '12', name: 'Soft Drink', description: 'Choose your favorite', price: 2.99, category: 'Drink', image: require('./assets/images/IMG-20260303-WA0002 (2).jpg') },
];

const categories = ['All', 'Starter', 'Main', 'Dessert', 'Drink'];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const addToCart = (item, qty) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + qty } : c));
    } else {
      setCart([...cart, { ...item, quantity: qty }]);
    }
    setSelectedItem(null);
    setQuantity(1);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = c.quantity + delta;
        return newQty > 0 ? { ...c, quantity: newQty } : c;
      }
      return c;
    }));
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const placeOrder = () => {
    if (!customerName || !customerPhone) {
      Alert.alert('Missing Info', 'Please enter your name and phone number');
      return;
    }
    setOrderPlaced(true);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
  };

  const filteredItems = selectedCategory === 'All' ? menuItems : menuItems.filter(item => item.category === selectedCategory);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => { setSelectedItem(item); setQuantity(1); }}>
      <Image source={item.image} style={styles.menuImage} />
      <View style={styles.menuInfo}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuDesc}>{item.description}</Text>
        <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (orderPlaced) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>✓</Text>
          <Text style={styles.successTitle}>Order Placed!</Text>
          <Text style={styles.successText}>Thank you for your order. We'll contact you shortly.</Text>
          <TouchableOpacity style={styles.button} onPress={() => { setOrderPlaced(false); setScreen('home'); }}>
            <Text style={styles.buttonText}>Back to Menu</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {screen === 'home' && (
        <View style={styles.homeContainer}>
          <Image source={require('./assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.title}>Nicky's Kitchen</Text>
          <Text style={styles.subtitle}>Welcome to our restaurant</Text>
          <TouchableOpacity style={styles.button} onPress={() => setScreen('menu')}>
            <Text style={styles.buttonText}>View Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen('cart')}>
            <Text style={styles.secondaryButtonText}>Cart ({cart.length})</Text>
          </TouchableOpacity>
        </View>
      )}

      {screen === 'menu' && (
        <View style={styles.menuContainer}>
          <Text style={styles.screenTitle}>Our Menu</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map(cat => (
              <TouchableOpacity key={cat} style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]} onPress={() => setSelectedCategory(cat)}>
                <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <FlatList data={filteredItems} renderItem={renderItem} keyExtractor={item => item.id} contentContainerStyle={styles.menuList} />
        </View>
      )}

      {screen === 'cart' && (
        <View style={styles.cartContainer}>
          <Text style={styles.screenTitle}>Your Cart</Text>
          {cart.length === 0 ? (
            <Text style={styles.emptyText}>Your cart is empty</Text>
          ) : (
            <>
              <FlatList data={cart} keyExtractor={item => item.id} renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  <Image source={item.image} style={styles.cartImage} />
                  <View style={styles.cartInfo}>
                    <Text style={styles.cartName}>{item.name}</Text>
                    <Text style={styles.cartPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}><Text style={styles.qtyBtn}>-</Text></TouchableOpacity>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}><Text style={styles.qtyBtn}>+</Text></TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => removeFromCart(item.id)}><Text style={styles.removeBtn}>×</Text></TouchableOpacity>
                </View>
              )} />
              <View style={styles.totalSection}>
                <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
                <TouchableOpacity style={styles.button} onPress={() => setScreen('checkout')}>
                  <Text style={styles.buttonText}>Proceed to Checkout</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}

      {screen === 'checkout' && (
        <ScrollView style={styles.checkoutContainer}>
          <Text style={styles.screenTitle}>Checkout</Text>
          <Text style={styles.checkoutLabel}>Name</Text>
          <TextInput style={styles.input} value={customerName} onChangeText={setCustomerName} placeholder="Your name" />
          <Text style={styles.checkoutLabel}>Phone</Text>
          <TextInput style={styles.input} value={customerPhone} onChangeText={setCustomerPhone} placeholder="Your phone number" keyboardType="phone-pad" />
          <Text style={styles.checkoutLabel}>Order Summary</Text>
          {cart.map(item => (
            <View key={item.id} style={styles.orderRow}>
              <Text>{item.quantity}x {item.name}</Text>
              <Text>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.orderTotal}>
            <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={placeOrder}>
            <Text style={styles.buttonText}>Place Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen('cart')}>
            <Text style={styles.secondaryButtonText}>Back to Cart</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabBtn} onPress={() => setScreen('home')}>
          <Text style={[styles.tabText, screen === 'home' && styles.tabTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBtn} onPress={() => setScreen('menu')}>
          <Text style={[styles.tabText, screen === 'menu' && styles.tabTextActive]}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBtn} onPress={() => setScreen('cart')}>
          <Text style={[styles.tabText, screen === 'cart' && styles.tabTextActive]}>Cart ({cart.length})</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={!!selectedItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Image source={selectedItem.image} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalDesc}>{selectedItem.description}</Text>
                <Text style={styles.modalPrice}>${selectedItem.price.toFixed(2)}</Text>
                <View style={styles.qtySection}>
                  <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}><Text style={styles.qtyBtnLarge}>-</Text></TouchableOpacity>
                  <Text style={styles.qtyLarge}>{quantity}</Text>
                  <TouchableOpacity onPress={() => setQuantity(quantity + 1)}><Text style={styles.qtyBtnLarge}>+</Text></TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => addToCart(selectedItem, quantity)}>
                  <Text style={styles.buttonText}>Add to Cart - ${(selectedItem.price * quantity).toFixed(2)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedItem(null)}>
                  <Text style={styles.closeBtnText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  homeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 150, height: 150, borderRadius: 75, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#e74c3c', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  button: { backgroundColor: '#e74c3c', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25, marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  secondaryButton: { backgroundColor: '#f0f0f0', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25 },
  secondaryButtonText: { color: '#333', fontSize: 18, fontWeight: '600' },
  menuContainer: { flex: 1, paddingTop: 50 },
  screenTitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#333' },
  categoryScroll: { maxHeight: 50, marginBottom: 10 },
  categoryBtn: { paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 5, borderRadius: 20, backgroundColor: '#f0f0f0' },
  categoryBtnActive: { backgroundColor: '#e74c3c' },
  categoryText: { fontSize: 14, color: '#666' },
  categoryTextActive: { color: '#fff', fontWeight: '600' },
  menuList: { padding: 10 },
  menuItem: { flexDirection: 'row', marginBottom: 15, backgroundColor: '#fff', borderRadius: 15, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  menuImage: { width: 100, height: 100 },
  menuInfo: { flex: 1, padding: 10 },
  menuName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  menuDesc: { fontSize: 12, color: '#666', marginTop: 4 },
  menuPrice: { fontSize: 16, color: '#e74c3c', fontWeight: '600', marginTop: 8 },
  cartContainer: { flex: 1, paddingTop: 50, paddingBottom: 60 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
  cartItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  cartImage: { width: 60, height: 60, borderRadius: 10 },
  cartInfo: { flex: 1, marginLeft: 10 },
  cartName: { fontSize: 16, fontWeight: '600' },
  cartPrice: { color: '#e74c3c', fontWeight: '600' },
  quantityControls: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  qtyBtn: { fontSize: 20, padding: 8, color: '#e74c3c' },
  qty: { fontSize: 16, marginHorizontal: 10 },
  removeBtn: { fontSize: 24, color: '#999', padding: 5 },
  totalSection: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  totalText: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#333' },
  checkoutContainer: { flex: 1, padding: 20, paddingTop: 50 },
  checkoutLabel: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 15, fontSize: 16 },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  orderTotal: { marginVertical: 20 },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff', paddingBottom: 20 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 15 },
  tabText: { fontSize: 14, color: '#999' },
  tabTextActive: { color: '#e74c3c', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, alignItems: 'center' },
  modalImage: { width: '100%', height: 200, borderRadius: 15, marginBottom: 15 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  modalDesc: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
  modalPrice: { fontSize: 22, color: '#e74c3c', fontWeight: 'bold', marginVertical: 15 },
  qtySection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  qtyBtnLarge: { fontSize: 30, padding: 15, color: '#e74c3c' },
  qtyLarge: { fontSize: 24, marginHorizontal: 25, fontWeight: '600' },
  closeBtn: { marginTop: 10 },
  closeBtnText: { fontSize: 16, color: '#999' },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  successEmoji: { fontSize: 80, marginBottom: 20 },
  successTitle: { fontSize: 28, fontWeight: 'bold', color: '#27ae60', marginBottom: 10 },
  successText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
});
