import { prisma } from "@/lib/prisma";
import HeaderNav from "./HeaderNav";

export default async function Header() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return <HeaderNav categories={categories} />;
}
