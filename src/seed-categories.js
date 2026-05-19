require('dotenv').config();
const mongoose  = require('mongoose');
const connectDB = require('./config/db');
const Category  = require('./models/Category');

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const upsert = (data) =>
  Category.findOneAndUpdate({ slug: data.slug }, data, { upsert: true, new: true });

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding full category tree...\n');

  // ── Level 0: Root categories ──────────────────────────────────────────────
  const roots = [
    { name: 'Clothing',              icon: '👕', sortOrder: 0  },
    { name: 'Footwear',              icon: '👟', sortOrder: 1  },
    { name: 'Climbing Gear',         icon: '🧗', sortOrder: 2  },
    { name: 'Camping & Trekking',    icon: '🏕️', sortOrder: 3  },
    { name: 'Backpacks & Bags',      icon: '🎒', sortOrder: 4  },
    { name: 'Accessories',           icon: '🧤', sortOrder: 5  },
    { name: 'Training & Fitness',    icon: '🏋️', sortOrder: 6  },
    { name: 'Gift & Lifestyle',      icon: '🎁', sortOrder: 7  },
    { name: 'Sale & Outlet',         icon: '🔥', sortOrder: 8  },
    { name: 'Shop by Brand',         icon: '🏷️', sortOrder: 9  },
  ];

  const R = {};
  for (const r of roots) {
    R[r.name] = await upsert({ name: r.name, slug: slug(r.name), icon: r.icon, depth: 0, sortOrder: r.sortOrder, isActive: true });
  }
  console.log(`✔  ${roots.length} root categories`);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const sub = async (rootName, name, order = 0) => {
    const parent = R[rootName];
    return upsert({ name, slug: slug(name), icon: '📁', depth: 1, parent: parent._id, sortOrder: order, isActive: true });
  };

  const child = async (parentDoc, name, order = 0) =>
    upsert({ name, slug: slug(name), icon: '📌', depth: 2, parent: parentDoc._id, sortOrder: order, isActive: true });

  // ── CLOTHING ──────────────────────────────────────────────────────────────
  const jackets    = await sub('Clothing', 'Jackets', 0);
  const pants      = await sub('Clothing', 'Pants', 1);
  const baselayers = await sub('Clothing', 'Baselayers', 2);
  const midlayers  = await sub('Clothing', 'Midlayers', 3);
  const tshirts    = await sub('Clothing', 'T-Shirts & Tops', 4);
  const underwear  = await sub('Clothing', 'Underwear', 5);

  await child(jackets, 'Waterproof Jackets', 0);
  await child(jackets, 'Down Jackets', 1);
  await child(jackets, 'Puffer Jackets', 2);
  await child(jackets, 'Insulated Jackets', 3);
  await child(jackets, 'Softshell Jackets', 4);
  await child(jackets, 'Vests & Gilets', 5);
  await child(jackets, 'Gore-Tex Jackets', 6);
  await child(jackets, 'Windbreakers', 7);
  await child(jackets, 'Fleece Jackets', 8);
  await child(jackets, '3-in-1 Jackets', 9);

  await child(pants, 'Lightweight Pants', 0);
  await child(pants, 'Softshell Pants', 1);
  await child(pants, 'Waterproof Pants', 2);
  await child(pants, 'Insulated Pants', 3);
  await child(pants, 'Shorts', 4);
  await child(pants, 'Leggings', 5);
  await child(pants, 'Convertible Pants', 6);
  await child(pants, 'Trekking Pants', 7);

  await child(baselayers, 'Tops Long Sleeve', 0);
  await child(baselayers, 'Tops Short Sleeve', 1);
  await child(baselayers, 'Bottoms', 2);
  await child(baselayers, 'Merino Wool Baselayers', 3);
  await child(baselayers, 'Synthetic Baselayers', 4);

  await child(midlayers, 'Fleece Pullovers', 0);
  await child(midlayers, 'Fleece Jackets Midlayer', 1);
  await child(midlayers, 'Hoodies', 2);
  await child(midlayers, 'Sweaters', 3);

  await child(tshirts, 'Graphic T-Shirts', 0);
  await child(tshirts, 'Performance T-Shirts', 1);
  await child(tshirts, 'Tank Tops', 2);
  await child(tshirts, 'Polo Shirts', 3);

  await child(underwear, 'Boxers', 0);
  await child(underwear, 'Briefs', 1);
  await child(underwear, 'Sports Bras', 2);

  console.log('✔  Clothing subtree done');

  // ── FOOTWEAR ──────────────────────────────────────────────────────────────
  const hikingShoes   = await sub('Footwear', 'Hiking & Trekking Shoes', 0);
  const climbingShoes = await sub('Footwear', 'Climbing Shoes', 1);
  const approachShoes = await sub('Footwear', 'Approach Shoes', 2);
  const sandals       = await sub('Footwear', 'Sandals & Slippers', 3);
  const socks         = await sub('Footwear', 'Socks', 4);
  const gaiters       = await sub('Footwear', 'Gaiters', 5);

  await child(hikingShoes, 'Low Cut Hiking Shoes', 0);
  await child(hikingShoes, 'Mid Cut Hiking Shoes', 1);
  await child(hikingShoes, 'High Cut Trekking Boots', 2);
  await child(hikingShoes, 'Waterproof Boots Gore-Tex', 3);

  await child(climbingShoes, 'Neutral Shoes', 0);
  await child(climbingShoes, 'Moderate Shoes', 1);
  await child(climbingShoes, 'Aggressive Shoes', 2);

  await child(approachShoes, "Men's Approach Shoes", 0);
  await child(approachShoes, "Women's Approach Shoes", 1);

  await child(sandals, 'Hiking Sandals', 0);
  await child(sandals, 'Recovery Sandals', 1);
  await child(sandals, 'Camp Slippers', 2);

  await child(socks, 'Liner Socks', 0);
  await child(socks, 'Hiking Socks Light', 1);
  await child(socks, 'Hiking Socks Medium', 2);
  await child(socks, 'Hiking Socks Heavy', 3);
  await child(socks, 'Merino Wool Socks', 4);

  await child(gaiters, 'Low Gaiters', 0);
  await child(gaiters, 'High Gaiters', 1);
  await child(gaiters, 'Waterproof Gaiters', 2);

  console.log('✔  Footwear subtree done');

  // ── CLIMBING GEAR ─────────────────────────────────────────────────────────
  const harnesses   = await sub('Climbing Gear', 'Harnesses', 0);
  const ropes       = await sub('Climbing Gear', 'Ropes', 1);
  const belayDevs   = await sub('Climbing Gear', 'Belay & Rappel Devices', 2);
  const carabiners  = await sub('Climbing Gear', 'Carabiners', 3);
  const quickdraws  = await sub('Climbing Gear', 'Quickdraws', 4);
  const helmets     = await sub('Climbing Gear', 'Helmets', 5);
  const chalk       = await sub('Climbing Gear', 'Chalk & Chalk Bags', 6);
  const crashPads   = await sub('Climbing Gear', 'Crash Pads', 7);
  const holds       = await sub('Climbing Gear', 'Climbing Holds', 8);
  const tradGear    = await sub('Climbing Gear', 'Protection Trad Gear', 9);
  const slings      = await sub('Climbing Gear', 'Slings & Runners', 10);
  const ascenders   = await sub('Climbing Gear', 'Ascenders & Pulleys', 11);

  await child(harnesses, 'Sport Climbing Harnesses', 0);
  await child(harnesses, 'Trad Climbing Harnesses', 1);
  await child(harnesses, "Women's Specific Harnesses", 2);
  await child(harnesses, "Kids' Harnesses", 3);
  await child(harnesses, 'Alpine Harnesses', 4);

  await child(ropes, 'Single Ropes', 0);
  await child(ropes, 'Half Ropes', 1);
  await child(ropes, 'Twin Ropes', 2);
  await child(ropes, 'Static Ropes', 3);

  await child(belayDevs, 'Assisted Braking Devices', 0);
  await child(belayDevs, 'Tubular Devices', 1);
  await child(belayDevs, 'Figure 8 Descenders', 2);
  await child(belayDevs, 'Auto-locking Devices', 3);

  await child(carabiners, 'Locking Carabiners Screwgate', 0);
  await child(carabiners, 'Locking Carabiners Twist Lock', 1);
  await child(carabiners, 'Non-Locking Carabiners', 2);
  await child(carabiners, 'Wiregate Carabiners', 3);

  await child(quickdraws, 'Sport Quickdraws', 0);
  await child(quickdraws, 'Alpine Quickdraws', 1);
  await child(quickdraws, 'Extendable Quickdraws', 2);

  await child(helmets, 'Hardshell Helmets', 0);
  await child(helmets, 'Foam Helmets In-Mold', 1);
  await child(helmets, "Women's Helmets", 2);

  await child(chalk, 'Loose Chalk', 0);
  await child(chalk, 'Chalk Balls', 1);
  await child(chalk, 'Chalk Bags', 2);
  await child(chalk, 'Chalk Buckets', 3);
  await child(chalk, 'Liquid Chalk', 4);

  await child(crashPads, 'Organic Crash Pads', 0);
  await child(crashPads, 'Foam Crash Pads', 1);
  await child(crashPads, 'Hybrid Crash Pads', 2);
  await child(crashPads, 'Blubber Pads', 3);

  await child(holds, 'Jugs', 0);
  await child(holds, 'Crimps', 1);
  await child(holds, 'Slopers', 2);
  await child(holds, 'Pinches', 3);
  await child(holds, 'Pockets', 4);
  await child(holds, 'Volumes', 5);

  await child(tradGear, 'Cams', 0);
  await child(tradGear, 'Nuts & Stoppers', 1);
  await child(tradGear, 'Hexes', 2);
  await child(tradGear, 'Tricams', 3);

  await child(slings, 'Dyneema Slings', 0);
  await child(slings, 'Nylon Slings', 1);
  await child(slings, 'Daisy Chains', 2);
  await child(slings, 'Personal Anchor Systems', 3);

  await child(ascenders, 'Ascenders Jumar', 0);
  await child(ascenders, 'Pulleys', 1);
  await child(ascenders, 'Haul Bags', 2);

  console.log('✔  Climbing Gear subtree done');

  // ── CAMPING & TREKKING ────────────────────────────────────────────────────
  const tents      = await sub('Camping & Trekking', 'Tents', 0);
  const sleepBags  = await sub('Camping & Trekking', 'Sleeping Bags', 1);
  const sleepPads  = await sub('Camping & Trekking', 'Sleeping Pads & Mats', 2);
  const cooking    = await sub('Camping & Trekking', 'Cooking & Kitchen', 3);
  const poles      = await sub('Camping & Trekking', 'Trekking Poles', 4);
  const lighting   = await sub('Camping & Trekking', 'Lighting', 5);
  const knives     = await sub('Camping & Trekking', 'Knives & Tools', 6);
  const navigation = await sub('Camping & Trekking', 'Navigation', 7);
  const furniture  = await sub('Camping & Trekking', 'Camp Furniture', 8);

  await child(tents, 'Backpacking Tents 1 Person', 0);
  await child(tents, 'Backpacking Tents 2 Person', 1);
  await child(tents, 'Backpacking Tents 3 Plus Person', 2);
  await child(tents, 'Ultralight Tents', 3);
  await child(tents, '4-Season Tents', 4);
  await child(tents, 'Tent Footprints', 5);

  await child(sleepBags, 'Down Sleeping Bags', 0);
  await child(sleepBags, 'Synthetic Sleeping Bags', 1);
  await child(sleepBags, 'Sleeping Bag Liners', 2);

  await child(sleepPads, 'Inflatable Mats', 0);
  await child(sleepPads, 'Foam Pads', 1);
  await child(sleepPads, 'Closed Cell Foam Pads', 2);
  await child(sleepPads, 'Pillows', 3);

  await child(cooking, 'Stoves Canister', 0);
  await child(cooking, 'Stoves Liquid Fuel', 1);
  await child(cooking, 'Stoves Wood Tablet', 2);
  await child(cooking, 'Cookware Sets', 3);
  await child(cooking, 'Pots & Pans', 4);
  await child(cooking, 'Cutlery & Utensils', 5);
  await child(cooking, 'Mugs & Cups', 6);
  await child(cooking, 'Water Filters & Purifiers', 7);
  await child(cooking, 'Water Bottles', 8);
  await child(cooking, 'Hydration Bladders', 9);

  await child(poles, 'Carbon Fiber Poles', 0);
  await child(poles, 'Aluminum Poles', 1);
  await child(poles, 'Folding Poles Z-Poles', 2);
  await child(poles, 'Pole Accessories', 3);

  await child(lighting, 'Headlamps', 0);
  await child(lighting, 'Lanterns', 1);
  await child(lighting, 'Flashlights', 2);
  await child(lighting, 'Tent Lights', 3);

  await child(knives, 'Multi-tools', 0);
  await child(knives, 'Knives', 1);
  await child(knives, 'Shovels & Trowels', 2);

  await child(navigation, 'Compasses', 0);
  await child(navigation, 'GPS Devices', 1);
  await child(navigation, 'Maps & Guidebooks', 2);
  await child(navigation, 'Watches Altimeter Barometer', 3);
  await child(navigation, 'Satellite Communicators', 4);

  await child(furniture, 'Camp Chairs', 0);
  await child(furniture, 'Camp Tables', 1);
  await child(furniture, 'Hammocks', 2);

  console.log('✔  Camping & Trekking subtree done');

  // ── BACKPACKS & BAGS ──────────────────────────────────────────────────────
  const hikePacks   = await sub('Backpacks & Bags', 'Hiking Backpacks', 0);
  const climbPacks  = await sub('Backpacks & Bags', 'Climbing Packs', 1);
  const hydration   = await sub('Backpacks & Bags', 'Hydration Packs', 2);
  const travel      = await sub('Backpacks & Bags', 'Travel & Duffel Bags', 3);
  const dryBags     = await sub('Backpacks & Bags', 'Dry Bags & Stuff Sacks', 4);
  const rainCovers  = await sub('Backpacks & Bags', 'Rain Covers', 5);

  await child(hikePacks, 'Daypacks 10-30L', 0);
  await child(hikePacks, 'Weekend Packs 30-50L', 1);
  await child(hikePacks, 'Multi-day Packs 50-70L', 2);
  await child(hikePacks, 'Expedition Packs 70L Plus', 3);

  await child(climbPacks, 'Crag Bags', 0);
  await child(climbPacks, 'Haul Bags', 1);
  await child(climbPacks, 'Rope Bags', 2);

  await child(hydration, 'Running Vests', 0);
  await child(hydration, 'Hydration Backpacks', 1);

  await child(travel, 'Duffel Bags', 0);
  await child(travel, 'Wheeled Duffels', 1);
  await child(travel, 'Travel Backpacks', 2);

  await child(dryBags, 'Dry Bags', 0);
  await child(dryBags, 'Stuff Sacks', 1);
  await child(dryBags, 'Compression Sacks', 2);

  await child(rainCovers, 'Backpack Rain Covers', 0);

  console.log('✔  Backpacks & Bags subtree done');

  // ── ACCESSORIES ───────────────────────────────────────────────────────────
  const gloves     = await sub('Accessories', 'Gloves & Mitts', 0);
  const headwear   = await sub('Accessories', 'Headwear', 1);
  const belts      = await sub('Accessories', 'Belts & Braces', 2);
  const eyewear    = await sub('Accessories', 'Eyewear', 3);
  const sunInsect  = await sub('Accessories', 'Sun & Insect Protection', 4);
  const skinCare   = await sub('Accessories', 'Skin & Foot Care', 5);
  const umbrellas  = await sub('Accessories', 'Umbrellas & Rain Gear', 6);
  const locks      = await sub('Accessories', 'Locks & Security', 7);

  await child(gloves, 'Liner Gloves', 0);
  await child(gloves, 'Insulated Gloves', 1);
  await child(gloves, 'Waterproof Gloves', 2);
  await child(gloves, 'Mittens', 3);
  await child(gloves, 'Belay Gloves', 4);
  await child(gloves, 'Approach Gloves', 5);

  await child(headwear, 'Beanies', 0);
  await child(headwear, 'Caps & Hats', 1);
  await child(headwear, 'Headbands', 2);
  await child(headwear, 'Balaclavas', 3);
  await child(headwear, 'Neck Tubes & Buffs', 4);
  await child(headwear, 'Sun Hats', 5);

  await child(belts, 'Belts', 0);
  await child(belts, 'Suspenders & Braces', 1);

  await child(eyewear, 'Sunglasses', 0);
  await child(eyewear, 'Goggles', 1);
  await child(eyewear, 'Glacier Glasses', 2);

  await child(sunInsect, 'Sunscreen', 0);
  await child(sunInsect, 'Lip Balm SPF', 1);
  await child(sunInsect, 'Insect Repellent', 2);
  await child(sunInsect, 'Mosquito Nets', 3);

  await child(skinCare, 'Blister Plasters', 0);
  await child(skinCare, 'Tape', 1);
  await child(skinCare, 'Foot Cream', 2);
  await child(skinCare, 'Hand Cream', 3);

  await child(umbrellas, 'Trekking Umbrellas', 0);
  await child(umbrellas, 'Ponchos', 1);

  await child(locks, 'Luggage Locks', 0);
  await child(locks, 'Cable Locks', 1);
  await child(locks, 'Pacsafe', 2);

  console.log('✔  Accessories subtree done');

  // ── TRAINING & FITNESS ────────────────────────────────────────────────────
  const hangboards = await sub('Training & Fitness', 'Hangboards', 0);
  const grip       = await sub('Training & Fitness', 'Grip Trainers', 1);
  const bands      = await sub('Training & Fitness', 'Resistance Bands', 2);
  const recovery   = await sub('Training & Fitness', 'Foam Rollers & Recovery', 3);
  const books      = await sub('Training & Fitness', 'Books & Guides', 4);

  await child(hangboards, 'Wooden Hangboards', 0);
  await child(hangboards, 'Resin Hangboards', 1);
  await child(hangboards, 'Portable Hangboards', 2);

  await child(grip, 'Grip Balls', 0);
  await child(grip, 'Finger Strengtheners', 1);
  await child(grip, 'Pinch Blocks', 2);

  await child(bands, 'Loop Bands', 0);
  await child(bands, 'Tube Bands', 1);

  await child(recovery, 'Foam Rollers', 0);
  await child(recovery, 'Massage Balls', 1);
  await child(recovery, 'Yoga Mats', 2);

  await child(books, 'Climbing Technique Books', 0);
  await child(books, 'Training Books', 1);
  await child(books, 'Mental Training', 2);

  console.log('✔  Training & Fitness subtree done');

  // ── GIFT & LIFESTYLE ──────────────────────────────────────────────────────
  const giftCards  = await sub('Gift & Lifestyle', 'Gift Cards', 0);
  const booksMags  = await sub('Gift & Lifestyle', 'Books & Magazines', 1);
  const stickers   = await sub('Gift & Lifestyle', 'Stickers & Patches', 2);
  const mugs       = await sub('Gift & Lifestyle', 'Mugs & Drinkware', 3);
  const posters    = await sub('Gift & Lifestyle', 'Posters & Art', 4);

  await child(giftCards, 'Physical Gift Card', 0);
  await child(giftCards, 'E-Gift Card', 1);

  await child(booksMags, 'Guidebooks', 0);
  await child(booksMags, 'Coffee Table Books', 1);
  await child(booksMags, 'Journals', 2);

  await child(stickers, 'Brand Stickers', 0);
  await child(stickers, 'Climbing Patches', 1);

  await child(mugs, 'Enamel Mugs', 0);
  await child(mugs, 'Insulated Mugs', 1);

  await child(posters, 'Climbing Posters', 0);
  await child(posters, 'Wall Art', 1);

  console.log('✔  Gift & Lifestyle subtree done');

  // ── SALE & OUTLET ─────────────────────────────────────────────────────────
  const saleByCategory = await sub('Sale & Outlet', 'Sale by Category', 0);
  const saleByDiscount = await sub('Sale & Outlet', 'Sale by Discount', 1);
  const lastChance     = await sub('Sale & Outlet', 'Last Chance & Clearance', 2);
  const preOwned       = await sub('Sale & Outlet', 'Pre-Owned Gear & Used', 3);
  const factorySeconds = await sub('Sale & Outlet', 'Factory Seconds', 4);

  await child(saleByCategory, 'Sale Clothing', 0);
  await child(saleByCategory, 'Sale Footwear', 1);
  await child(saleByCategory, 'Sale Climbing Gear', 2);
  await child(saleByCategory, 'Sale Camping Gear', 3);
  await child(saleByCategory, 'Sale Backpacks', 4);

  await child(saleByDiscount, 'Up to 30 Percent Off', 0);
  await child(saleByDiscount, '30 to 50 Percent Off', 1);
  await child(saleByDiscount, '50 Percent Off and More', 2);

  console.log('✔  Sale & Outlet subtree done');

  // ── SHOP BY BRAND ─────────────────────────────────────────────────────────
  const brandNames = [
    'La Sportiva', 'Scarpa', 'Petzl', 'Black Diamond', 'Mammut',
    'Edelrid', 'Five Ten', 'Evolv', 'Ocun', 'DMM', 'Wild Country',
    'Beal', "Arc'teryx", 'Patagonia', 'The North Face', 'Mountain Hardwear',
    'Rab', 'Montane', 'Salomon', 'Merrell', 'Keen', 'Osprey', 'Deuter',
    'Gregory', 'MSR', 'Jetboil', 'Sea to Summit', 'Therm-a-Rest', 'Nalgene',
  ];

  for (let i = 0; i < brandNames.length; i++) {
    await upsert({
      name: brandNames[i],
      slug: slug('brand-' + brandNames[i]),
      icon: '🏷️',
      depth: 1,
      parent: R['Shop by Brand']._id,
      sortOrder: i,
      isActive: true,
    });
  }

  console.log(`✔  ${brandNames.length} brand categories seeded`);

  const total = await Category.countDocuments();
  console.log(`\n🎉 Done! Total categories in DB: ${total}`);
  await mongoose.disconnect();
};

seed().catch(err => { console.error(err); process.exit(1); });
