import { PrismaClient } from "@prisma/client";
import data from "../../db.json";

const prisma = new PrismaClient();

async function main() {
  const id = Math.random().toString(36).substring(2, 9);

  // const user = await prisma.user.create({
  //   data: {
  //     email: "sssathish73362@gmail.com",
  //     name: "Sathish S",
  //     watchlistId: id,
  //     watchlist: {
  //       create: {
  //         stocks: ["AAPL", "MSFT", "GOOGL"],
  //         id,
  //       },
  //     },
  //   },
  // });

  // const user = await prisma.user.findUnique({
  //   where: {
  //     email: "sssathish73362@gmail.com",
  //   },
  // });

  // const watchlist = await prisma.watchlist.findUnique({
  //   where: {
  //     id: user?.watchlistId,
  //   },
  // });

  const stocks = await prisma.stock.createMany({
    data: data.stocks,
  });

  const news = await prisma.news.createMany({
    data: data.news,
  });

  console.log("Database seeded!", stocks, news);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
