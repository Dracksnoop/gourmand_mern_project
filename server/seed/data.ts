// Seed content for local development and the public demo. Kept separate from the
// seeding logic so the two can be edited without stepping on each other.

type SeedMenu = {
    name: string;
    description: string;
    price: number;
    image: string;
};

export type SeedRestaurant = {
    restaurantName: string;
    city: string;
    country: string;
    deliveryTime: number;
    cuisines: string[];
    imageUrl: string;
    owner: { fullname: string; email: string; contact: number };
    menus: SeedMenu[];
};

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

export const DEMO_CUSTOMER = {
    fullname: "Demo Guest",
    email: "demo@gourmand.app",
    password: "demo1234",
    contact: 9000000001,
    address: "42 Civil Lines",
    city: "Jaipur",
    country: "India",
};

export const seedRestaurants: SeedRestaurant[] = [
    {
        restaurantName: "Kesar Rasoi",
        city: "Jaipur",
        country: "India",
        deliveryTime: 32,
        cuisines: ["North Indian", "Rajasthani", "Thali"],
        imageUrl: img("1517248135467-4c7edcad34c4"),
        owner: { fullname: "Anita Sharma", email: "anita@kesarrasoi.in", contact: 9810011001 },
        menus: [
            { name: "Laal Maas", description: "Slow-cooked mutton in a fiery Mathania chilli gravy.", price: 480, image: img("1585937421612-70a008356fbe") },
            { name: "Dal Baati Churma", description: "Baked wheat baatis, panchmel dal and sweet churma.", price: 320, image: img("1546833999-b9f581a1996d") },
            { name: "Gatte Ki Sabzi", description: "Gram flour dumplings simmered in spiced yoghurt.", price: 260, image: img("1631452180519-c014fe946bc7") },
            { name: "Ker Sangri", description: "Desert berries and beans tempered with red chilli.", price: 240, image: img("1596797038530-2c107229654b") },
            { name: "Ghewar", description: "Honeycomb disc soaked in syrup, topped with rabri.", price: 180, image: img("1606471191009-63994c53433b") },
        ],
    },
    {
        restaurantName: "Bombay Canteen Co.",
        city: "Mumbai",
        country: "India",
        deliveryTime: 28,
        cuisines: ["Street Food", "Continental", "Bar Bites"],
        imageUrl: img("1552566626-52f8b828add9"),
        owner: { fullname: "Rohan Mehta", email: "rohan@bombaycanteen.in", contact: 9810011002 },
        menus: [
            { name: "Vada Pav Sliders", description: "Three mini pavs, dry garlic chutney, fried chilli.", price: 190, image: img("1606491956689-2ea866880c84") },
            { name: "Bombay Sandwich", description: "Grilled masala sandwich with beetroot and chutney.", price: 160, image: img("1528735602780-2552fd46c7af") },
            { name: "Pav Bhaji", description: "Buttered mash of seasonal vegetables with soft pav.", price: 220, image: img("1606491956689-2ea866880c84") },
            { name: "Bhel Puri", description: "Puffed rice, tamarind, raw mango and sev.", price: 140, image: img("1601050690597-df0568f70950") },
            { name: "Cutting Chai Tiramisu", description: "Masala chai soaked sponge, mascarpone cream.", price: 210, image: img("1571877227200-a0d98ea607e9") },
        ],
    },
    {
        restaurantName: "Nizam's Table",
        city: "Hyderabad",
        country: "India",
        deliveryTime: 40,
        cuisines: ["Biryani", "Mughlai", "Kebabs"],
        imageUrl: img("1563379091339-03b21ab4a4f8"),
        owner: { fullname: "Farhan Qureshi", email: "farhan@nizamstable.in", contact: 9810011003 },
        menus: [
            { name: "Hyderabadi Dum Biryani", description: "Sealed-pot mutton biryani with saffron and mint.", price: 520, image: img("1563379091339-03b21ab4a4f8") },
            { name: "Chicken 65", description: "Curry-leaf fried chicken with green chilli.", price: 340, image: img("1626082927389-6cd097cdc6ec") },
            { name: "Galouti Kebab", description: "Melt-in-mouth minced kebabs with warqi paratha.", price: 420, image: img("1601050690597-df0568f70950") },
            { name: "Mirchi Ka Salan", description: "Peanut and sesame gravy with long green chillies.", price: 180, image: img("1631452180519-c014fe946bc7") },
            { name: "Double Ka Meetha", description: "Fried bread pudding in cardamom milk.", price: 190, image: img("1606471191009-63994c53433b") },
        ],
    },
    {
        restaurantName: "Forno Nero",
        city: "Bengaluru",
        country: "India",
        deliveryTime: 35,
        cuisines: ["Italian", "Pizza", "Pasta"],
        imageUrl: img("1513104890138-7c749659a591"),
        owner: { fullname: "Priya Nair", email: "priya@fornonero.in", contact: 9810011004 },
        menus: [
            { name: "Margherita", description: "San Marzano, fior di latte, basil, 48-hour dough.", price: 420, image: img("1574071318508-1cdbab80d002") },
            { name: "Diavola", description: "Spicy salami, chilli honey, smoked scamorza.", price: 520, image: img("1565299624946-b28f40a0ae38") },
            { name: "Cacio e Pepe", description: "Tonnarelli, pecorino romano, cracked black pepper.", price: 460, image: img("1621996346565-e3dbc646d9a9") },
            { name: "Truffle Arancini", description: "Risotto spheres, taleggio centre, truffle aioli.", price: 380, image: img("1541014741259-de529411b96a") },
            { name: "Tiramisu", description: "Savoiardi, espresso, mascarpone, cocoa.", price: 280, image: img("1571877227200-a0d98ea607e9") },
        ],
    },
    {
        restaurantName: "Wok & Roll",
        city: "Delhi",
        country: "India",
        deliveryTime: 30,
        cuisines: ["Chinese", "Pan Asian", "Momos"],
        imageUrl: img("1552611052-33e04de081de"),
        owner: { fullname: "Tenzin Dorjee", email: "tenzin@wokandroll.in", contact: 9810011005 },
        menus: [
            { name: "Steamed Chicken Momos", description: "Eight pieces with fired tomato chutney.", price: 220, image: img("1534422298391-e4f8c172dddb") },
            { name: "Chilli Garlic Noodles", description: "Hakka noodles tossed with burnt garlic.", price: 260, image: img("1585032226651-759b368d7246") },
            { name: "Kung Pao Paneer", description: "Roasted peanuts, dried red chilli, celery.", price: 300, image: img("1603133872878-684f208fb84b") },
            { name: "Thukpa", description: "Himalayan noodle soup with vegetables.", price: 240, image: img("1547592166-23ac45744acd") },
            { name: "Darsaan", description: "Honey-glazed noodles with vanilla ice cream.", price: 200, image: img("1563805042-7684c019e1cb") },
        ],
    },
    {
        restaurantName: "Coastal Curry House",
        city: "Chennai",
        country: "India",
        deliveryTime: 38,
        cuisines: ["South Indian", "Seafood", "Chettinad"],
        imageUrl: img("1589301760014-d929f3979dbc"),
        owner: { fullname: "Meera Iyer", email: "meera@coastalcurry.in", contact: 9810011006 },
        menus: [
            { name: "Chettinad Fish Curry", description: "Seer fish in a peppery tamarind gravy.", price: 460, image: img("1626082927389-6cd097cdc6ec") },
            { name: "Prawn Thokku", description: "Prawns roasted with shallots and curry leaf.", price: 480, image: img("1596797038530-2c107229654b") },
            { name: "Podi Idli", description: "Mini idlis tossed in gunpowder and sesame oil.", price: 180, image: img("1589301760014-d929f3979dbc") },
            { name: "Ghee Roast Dosa", description: "Crisp dosa with coconut chutney and sambar.", price: 200, image: img("1630383249896-424e482df921") },
            { name: "Filter Coffee", description: "Degree coffee served in a steel tumbler.", price: 90, image: img("1509042239860-f550ce710b93") },
        ],
    },
    {
        restaurantName: "Green Fork",
        city: "Pune",
        country: "India",
        deliveryTime: 25,
        cuisines: ["Healthy", "Salads", "Continental"],
        imageUrl: img("1512621776951-a57141f2eefd"),
        owner: { fullname: "Kabir Deshpande", email: "kabir@greenfork.in", contact: 9810011007 },
        menus: [
            { name: "Quinoa Buddha Bowl", description: "Roast pumpkin, chickpea, tahini dressing.", price: 340, image: img("1512621776951-a57141f2eefd") },
            { name: "Grilled Chicken Caesar", description: "Cos lettuce, parmesan crisp, soft egg.", price: 380, image: img("1546793665-c74683f339c1") },
            { name: "Avocado Sourdough", description: "Smashed avocado, chilli flakes, poached egg.", price: 320, image: img("1541519227354-08fa5d50c44d") },
            { name: "Beetroot Hummus Bowl", description: "House hummus, olives, warm pita.", price: 280, image: img("1547592166-23ac45744acd") },
            { name: "Cold Pressed Juice", description: "Orange, carrot and ginger, no added sugar.", price: 160, image: img("1600271886742-f049cd451bba") },
        ],
    },
    {
        restaurantName: "Park Street Grill",
        city: "Kolkata",
        country: "India",
        deliveryTime: 42,
        cuisines: ["Bengali", "Kebabs", "Rolls"],
        imageUrl: img("1555396273-367ea4eb4db5"),
        owner: { fullname: "Sourav Banerjee", email: "sourav@parkstreetgrill.in", contact: 9810011008 },
        menus: [
            { name: "Kosha Mangsho", description: "Slow-braised mutton with whole garam masala.", price: 500, image: img("1585937421612-70a008356fbe") },
            { name: "Kathi Roll", description: "Egg paratha wrap with chicken and onion.", price: 220, image: img("1600271886742-f049cd451bba") },
            { name: "Daab Chingri", description: "Prawns steamed in tender coconut with mustard.", price: 560, image: img("1596797038530-2c107229654b") },
            { name: "Luchi Aloo Dum", description: "Puffed white flour luchis with spiced potato.", price: 210, image: img("1630383249896-424e482df921") },
            { name: "Mishti Doi", description: "Clay-pot set sweet yoghurt.", price: 130, image: img("1563805042-7684c019e1cb") },
        ],
    },
];
