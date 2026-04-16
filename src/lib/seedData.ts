import { ref, set } from "firebase/database";
import { db } from "@/lib/firebase";

/**
 * Seed Firebase RTDB with sample data.
 * Uses the authenticated client-side Firebase instance.
 * Safe to call multiple times — will overwrite existing data.
 */
export async function seedDatabase() {
  const now = Date.now();

  // 1. Admin credentials
  await set(ref(db, "settings/admin"), {
    email: "admin@racecomputer.in",
    password: "admin123",
  });

  // 2. Products catalog (12 products)
  await set(ref(db, "products"), {
    product_1: { name: "Wireless Mouse", price: "499", category: "Accessories", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop", description: "Ergonomic wireless mouse with USB receiver", order: 0 },
    product_2: { name: "Mechanical Keyboard", price: "2499", category: "Accessories", image: "https://images.unsplash.com/photo-1541140532154-b024d70d3da5?w=400&h=400&fit=crop", description: "RGB mechanical keyboard with blue switches", order: 1 },
    product_3: { name: "USB-C Hub 7-in-1", price: "1299", category: "Accessories", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop", description: "7-in-1 USB-C hub with HDMI and USB 3.0", order: 2 },
    product_4: { name: "SSD 256GB SATA", price: "1899", category: "Components", image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop", description: "256GB SATA SSD, 550MB/s read speed", order: 3 },
    product_5: { name: "8GB DDR4 RAM", price: "2499", category: "Components", image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=400&fit=crop", description: "8GB DDR4 3200MHz desktop RAM", order: 4 },
    product_6: { name: "500W Power Supply", price: "2199", category: "Components", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop", description: "500W SMPS power supply, 80+ certified", order: 5 },
    product_7: { name: "Laptop Screen 15.6\"", price: "3499", category: "Repair Parts", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop", description: "15.6-inch FHD LED laptop screen", order: 6 },
    product_8: { name: "Laptop Battery", price: "1999", category: "Repair Parts", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=400&fit=crop", description: "Replacement laptop battery for HP/Dell/Lenovo", order: 7 },
    product_9: { name: "Laptop Keyboard", price: "1299", category: "Repair Parts", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop", description: "Replacement laptop keyboard, US layout", order: 8 },
    product_10: { name: "HP Laptop 15s", price: "32999", category: "Laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop", description: "HP 15s Ryzen 5, 8GB RAM, 512GB SSD", order: 9 },
    product_11: { name: "ASUS VivoBook", price: "45999", category: "Laptops", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop", description: "ASUS VivoBook 15 Intel i5, 16GB RAM", order: 10 },
    product_12: { name: "Gaming Mouse Pad XL", price: "799", category: "Accessories", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop", description: "Extended XL gaming mouse pad, 900x400mm", order: 11 },
  });

  // 3. Staff members (for staff login)
  await set(ref(db, "staff"), {
    staff_1: {
      name: "Rahul Kumar",
      email: "rahul@racecomputer.in",
      password: "rahul123",
      phone: "+91 98765 43210",
      active: true,
      createdAt: now - 86400000 * 30,
    },
    staff_2: {
      name: "Amit Sharma",
      email: "amit@racecomputer.in",
      password: "amit123",
      phone: "+91 87654 32109",
      active: true,
      createdAt: now - 86400000 * 20,
    },
    staff_3: {
      name: "Vikram Singh",
      email: "vikram@racecomputer.in",
      password: "vikram123",
      phone: "+91 76543 21098",
      active: true,
      createdAt: now - 86400000 * 10,
    },
    staff_4: {
      name: "Priya Patel",
      email: "priya@racecomputer.in",
      password: "priya123",
      phone: "+91 65432 10987",
      active: false,
      createdAt: now - 86400000 * 5,
    },
  });

  // 4. Sample service requests
  await set(ref(db, "serviceRequests"), {
    req_1: {
      name: "Suresh Jain",
      phone: "+91 94123 45678",
      address: "12, Sanganer Bazar, Near Post Office, Jaipur, Rajasthan 302029",
      serviceType: "Laptop Repair",
      problemDescription: "Laptop screen flickering and sometimes goes completely black. Need urgent repair.",
      status: "pending",
      acceptedBy: null,
      acceptedAt: null,
      createdAt: now - 3600000 * 2,
      completedAt: null,
    },
    req_2: {
      name: "Meena Devi",
      phone: "+91 94567 89012",
      address: "45, Pratap Nagar, Sector 5, Jaipur, Rajasthan 302033",
      serviceType: "Desktop Repair",
      problemDescription: "Desktop not booting up. Shows blue screen error.",
      status: "pending",
      acceptedBy: null,
      acceptedAt: null,
      createdAt: now - 3600000 * 1,
      completedAt: null,
    },
    req_3: {
      name: "Rajesh Agarwal",
      phone: "+91 93456 78901",
      address: "78, Malviya Nagar, Near Jaipur Hospital, Jaipur, Rajasthan 302017",
      serviceType: "Software Issue",
      problemDescription: "Windows activation issue and slow performance. Need OS reinstallation.",
      status: "accepted",
      acceptedBy: "Rahul Kumar",
      acceptedById: "staff_1",
      acceptedAt: now - 3600000 * 3,
      createdAt: now - 86400000 * 1,
      completedAt: null,
    },
    req_4: {
      name: "Kavita Sharma",
      phone: "+91 92345 67890",
      address: "23, Mansarovar, Extension, Jaipur, Rajasthan 302020",
      serviceType: "Hardware Upgrade",
      problemDescription: "Need to upgrade RAM from 4GB to 16GB and add SSD.",
      status: "accepted",
      acceptedBy: "Amit Sharma",
      acceptedById: "staff_2",
      acceptedAt: now - 7200000,
      createdAt: now - 86400000 * 1,
      completedAt: null,
    },
    req_5: {
      name: "Dinesh Verma",
      phone: "+91 91234 56789",
      address: "56, Vaishali Nagar, Near Amber Market, Jaipur, Rajasthan 302021",
      serviceType: "Home Installation",
      problemDescription: "New printer setup and WiFi configuration at home.",
      status: "completed",
      acceptedBy: "Rahul Kumar",
      acceptedById: "staff_1",
      acceptedAt: now - 86400000 * 2,
      createdAt: now - 86400000 * 3,
      completedAt: now - 86400000 * 2,
    },
    req_6: {
      name: "Anita Gupta",
      phone: "+91 90123 45678",
      address: "89, Tonk Road, Near SBI Bank, Jaipur, Rajasthan 302015",
      serviceType: "Laptop Repair",
      problemDescription: "Laptop overheating and battery draining very fast.",
      status: "completed",
      acceptedBy: "Amit Sharma",
      acceptedById: "staff_2",
      acceptedAt: now - 86400000 * 4,
      createdAt: now - 86400000 * 5,
      completedAt: now - 86400000 * 4,
    },
    req_7: {
      name: "Pawan Meena",
      phone: "+91 89012 34567",
      address: "34, Jagatpura, Near Amity University, Jaipur, Rajasthan 302025",
      serviceType: "Desktop Repair",
      problemDescription: "Desktop making loud noise from fan. CPU overheating issue.",
      status: "completed",
      acceptedBy: "Rahul Kumar",
      acceptedById: "staff_1",
      acceptedAt: now - 86400000 * 6,
      createdAt: now - 86400000 * 7,
      completedAt: now - 86400000 * 6,
    },
  });

  // 5. Sample product orders
  await set(ref(db, "productOrders"), {
    order_1: {
      productName: "Mechanical Keyboard",
      productPrice: "2499",
      customerName: "Sanjay Joshi",
      customerPhone: "+91 98765 11111",
      customerAddress: "12, C-Scheme, Ashok Marg, Jaipur 302001",
      status: "pending",
      createdAt: now - 3600000 * 4,
    },
    order_2: {
      productName: "8GB DDR4 RAM",
      productPrice: "2499",
      customerName: "Neha Rathore",
      customerPhone: "+91 98765 22222",
      customerAddress: "45, Raja Park, Near Gurudwara, Jaipur 302004",
      status: "pending",
      createdAt: now - 3600000 * 2,
    },
    order_3: {
      productName: "SSD 256GB SATA",
      productPrice: "1899",
      customerName: "Manish Kumar",
      customerPhone: "+91 98765 33333",
      customerAddress: "78, Shyam Nagar, Ext 1, Jaipur 302019",
      status: "confirmed",
      createdAt: now - 86400000 * 2,
    },
    order_4: {
      productName: "HP Laptop 15s",
      productPrice: "32999",
      customerName: "Geeta Devi",
      customerPhone: "+91 98765 44444",
      customerAddress: "23, Sitapura Industrial Area, Jaipur 302022",
      status: "confirmed",
      createdAt: now - 86400000 * 3,
    },
  });

  // 6. Sample enquiries
  await set(ref(db, "enquiries"), {
    enquiry_1: {
      name: "Ramesh Ojha",
      phone: "+91 91111 22222",
      category: "Desktop & Laptops",
      message: "I need a custom gaming PC built. Budget around 80K.",
      source: "contact_form",
      status: "new",
      createdAt: now - 3600000 * 5,
    },
    enquiry_2: {
      name: "Sunita Kumari",
      phone: "+91 92222 33333",
      category: "Networking Solutions",
      message: "Need WiFi setup for my office with 20+ computers.",
      source: "contact_form",
      status: "new",
      createdAt: now - 3600000 * 3,
    },
  });

  // 7. Clear staff locations (no active tracking by default)
  await set(ref(db, "staffLocations"), {});
}
