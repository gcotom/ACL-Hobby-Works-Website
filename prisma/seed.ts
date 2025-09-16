import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "501st Captain",
      priceCents: 5400,
      description: "Phase II helmet, weathered finish, DC-15A blaster.",
      imageUrl: null,
    },
    {
      name: "212th Airborne Sergeant",
      priceCents: 4900,
      description: "Airborne helmet, pauldron + kama set, matte seal.",
      imageUrl: null,
    },
    {
      name: "Coruscant Guard Commander",
      priceCents: 5200,
      description: "Red visor detailing, gloss seal, dual DC-17s.",
      imageUrl: null,
    },
    {
      name: "ARC Trooper (Custom)",
      priceCents: 6200,
      description: "Custom ARC markings, macrobinoculars, pauldron + kama.",
      imageUrl: null,
    },
    {
      name: "Wolfpack Trooper",
      priceCents: 5100,
      description: "Gray wolf sigil, Phase II helmet, light weathering.",
      imageUrl: null,
    },
    {
      name: "Geonosis Infantry",
      priceCents: 4800,
      description: "Earth-tone camo, sand-weathering, DC-15S blaster.",
      imageUrl: null,
    }
  ];

  for (const [index, p] of products.entries()) {
    await prisma.product.upsert({
      where: { id: `seed-product-${index}` },
      update: {
        priceCents: p.priceCents,
        description: p.description ?? null,
        imageUrl: p.imageUrl ?? null,
      },
      create: {
        id: `seed-product-${index}`,
        ...p,
      },
    });
  }

  await prisma.quote.upsert({
    where: { id: "seed-sample-quote" },
    update: {},
    create: {
      id: "seed-sample-quote",
      name: "CT-7567 (Rex)",
      email: "rex@example.com",
      baseLegion: "501st",
      helmet: "Phase II",
      finish: "Weathered",
      quantity: 1,
      notes: "Classic tally marks on the helmet. Subtle blaster scorch on chest.",
      status: "PENDING"
    }
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
