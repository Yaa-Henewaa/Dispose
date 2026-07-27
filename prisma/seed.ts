import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const adminEmail = (
    process.env.SEED_ADMIN_EMAIL || "owner@dispose.shop"
  ).toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const adminName = process.env.SEED_ADMIN_NAME || "Shop Owner";

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, passwordHash, name: adminName },
    update: { passwordHash, name: adminName },
  });
  console.log(`Admin user ready: ${adminEmail} / ${adminPassword}`);

  // --- Shop settings ---
  await prisma.shopSetting.upsert({
    where: { id: "shop" },
    create: {
      id: "shop",
      shopName: "Disposé",
      address: "12 Spintex Road, Accra, Ghana",
      hours: "Mon–Sat, 9am–7pm",
      phone: "+233 24 348 8612",
      whatsapp: "+233 24 348 8612",
      pickupNotes: "Please bring your order number when you arrive.",
    },
    update: {},
  });

  // --- Delivery settings ---
  const deliveryAreas = [
    { area: "Accra Central", fee: 15, isDefault: true },
    { area: "East Legon", fee: 25, isDefault: false },
    { area: "Spintex", fee: 20, isDefault: false },
    { area: "Tema", fee: 35, isDefault: false },
  ];
  for (const setting of deliveryAreas) {
    const existing = await prisma.deliverySetting.findFirst({
      where: { area: setting.area },
    });
    if (!existing) {
      await prisma.deliverySetting.create({ data: setting });
    }
  }

  // --- Categories ---
  const categoryDefs = [
    {
      name: "Disposables",
      slug: "disposables",
      children: ["Plates & Cutlery", "Cups", "Food Containers"],
    },
    {
      name: "Party Supplies",
      slug: "party-supplies",
      children: ["Balloons", "Decorations", "Party Favors"],
    },
    {
      name: "Toiletries",
      slug: "toiletries",
      children: ["Personal Care", "Cleaning Supplies"],
    },
  ];

  const categoryIds: Record<string, string> = {};

  for (const [index, def] of categoryDefs.entries()) {
    const parent = await prisma.category.upsert({
      where: { slug: def.slug },
      create: { name: def.name, slug: def.slug, sortOrder: index },
      update: {},
    });
    categoryIds[def.name] = parent.id;

    for (const [childIndex, childName] of def.children.entries()) {
      const childSlug = `${def.slug}-${childName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      const child = await prisma.category.upsert({
        where: { slug: childSlug },
        create: {
          name: childName,
          slug: childSlug,
          parentId: parent.id,
          sortOrder: childIndex,
        },
        update: {},
      });
      categoryIds[childName] = child.id;
    }
  }

  // --- Products (placeholder images via placehold.co) ---
  const products = [
    {
      name: "Disposable Plates (Pack of 50)",
      slug: "disposable-plates-pack-50",
      description: "Sturdy paper plates, great for parties and everyday use.",
      price: 35,
      stock: 60,
      category: "Plates & Cutlery",
      featured: true,
      images: ["https://placehold.co/600x600/1D9E75/FFFFFF?text=Plates"],
    },
    {
      name: "Plastic Cutlery Set (Pack of 24)",
      slug: "plastic-cutlery-set-24",
      description: "Forks, knives, and spoons — perfect for events.",
      price: 20,
      stock: 80,
      category: "Plates & Cutlery",
      featured: false,
      images: ["https://placehold.co/600x600/1D9E75/FFFFFF?text=Cutlery"],
    },
    {
      name: "Disposable Cups (Pack of 50)",
      slug: "disposable-cups-pack-50",
      description: "9oz paper cups, ideal for drinks at parties or the office.",
      price: 18,
      stock: 100,
      category: "Cups",
      featured: true,
      images: ["https://placehold.co/600x600/1D9E75/FFFFFF?text=Cups"],
    },
    {
      name: "Food Containers with Lids (Pack of 10)",
      slug: "food-containers-lids-10",
      description: "Leak-resistant containers, microwave safe.",
      price: 40,
      stock: 45,
      category: "Food Containers",
      featured: false,
      images: ["https://placehold.co/600x600/1D9E75/FFFFFF?text=Containers"],
    },
    {
      name: "Balloon Bundle (Pack of 30, Assorted)",
      slug: "balloon-bundle-30-assorted",
      description: "Colorful latex balloons for birthdays and celebrations.",
      price: 25,
      stock: 70,
      category: "Balloons",
      featured: true,
      images: ["https://placehold.co/600x600/D4537E/FFFFFF?text=Balloons"],
    },
    {
      name: "Happy Birthday Banner",
      slug: "happy-birthday-banner",
      description: "Bright and bold banner, 2 meters long.",
      price: 15,
      stock: 40,
      category: "Decorations",
      featured: false,
      images: ["https://placehold.co/600x600/D4537E/FFFFFF?text=Banner"],
    },
    {
      name: "Party Streamers (Set of 6 Rolls)",
      slug: "party-streamers-set-6",
      description: "Vibrant crepe paper streamers to decorate any space.",
      price: 12,
      stock: 90,
      category: "Decorations",
      featured: false,
      images: ["https://placehold.co/600x600/D4537E/FFFFFF?text=Streamers"],
    },
    {
      name: "Party Favor Bags (Pack of 20)",
      slug: "party-favor-bags-20",
      description: "Fun printed bags for party gifts and treats.",
      price: 22,
      stock: 55,
      category: "Party Favors",
      featured: false,
      images: ["https://placehold.co/600x600/D4537E/FFFFFF?text=Favors"],
    },
    {
      name: "Bath Soap Bar (3-Pack)",
      slug: "bath-soap-bar-3-pack",
      description: "Gentle moisturizing soap for everyday use.",
      price: 28,
      stock: 65,
      category: "Personal Care",
      featured: true,
      images: ["https://placehold.co/600x600/7F77DD/FFFFFF?text=Soap"],
    },
    {
      name: "Toothpaste (Family Pack, 2-Pack)",
      slug: "toothpaste-family-pack-2",
      description: "Fluoride toothpaste for the whole family.",
      price: 24,
      stock: 75,
      category: "Personal Care",
      featured: false,
      images: ["https://placehold.co/600x600/7F77DD/FFFFFF?text=Toothpaste"],
    },
    {
      name: "All-Purpose Cleaner (1L)",
      slug: "all-purpose-cleaner-1l",
      description: "Multi-surface cleaner for kitchens and bathrooms.",
      price: 30,
      stock: 50,
      category: "Cleaning Supplies",
      featured: false,
      images: ["https://placehold.co/600x600/7F77DD/FFFFFF?text=Cleaner"],
    },
    {
      name: "Toilet Tissue (Pack of 12 Rolls)",
      slug: "toilet-tissue-pack-12",
      description: "Soft, absorbent tissue rolls for home or office.",
      price: 45,
      stock: 3,
      category: "Cleaning Supplies",
      featured: true,
      images: ["https://placehold.co/600x600/7F77DD/FFFFFF?text=Tissue"],
    },
  ];

  for (const product of products) {
    const categoryId = categoryIds[product.category];
    if (!categoryId) continue;
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId,
        featured: product.featured,
        images: product.images,
        visibility: "VISIBLE",
      },
      update: {},
    });
  }

  console.log(
    `Seeded ${products.length} products across ${categoryDefs.length} categories.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
