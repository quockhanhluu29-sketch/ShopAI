import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const catalog = [
  ['shopai-phone-android-5g', 'Điện thoại Android 5G 128GB', 'Điện tử', 8990000, 'photo-1511707171634-5f897ff02aa9', 'Điện thoại 5G màn hình sắc nét, pin dung lượng lớn, phù hợp sử dụng hằng ngày.', 18],
  ['shopai-phone-premium-128gb', 'Điện thoại cao cấp 128GB', 'Điện tử', 18990000, 'photo-1592750475338-74b7b21085ab', 'Thiết kế hiện đại, camera độ phân giải cao và hiệu năng mượt mà.', 12],
  ['shopai-tablet-11-wifi', 'Máy tính bảng 11 inch Wi-Fi', 'Điện tử', 7990000, 'photo-1544244015-0df4b3ffc6b0', 'Màn hình rộng, tiện học tập, đọc sách và giải trí.', 15],
  ['shopai-laptop-office-14', 'Laptop văn phòng 14 inch', 'Điện tử', 15990000, 'photo-1496181133206-80ce9b88a853', 'Laptop gọn nhẹ cho công việc văn phòng và học tập.', 9],
  ['shopai-earbuds-noise-cancel', 'Tai nghe Bluetooth chống ồn', 'Điện tử', 1290000, 'photo-1505740420928-5e560c06d30e', 'Tai nghe không dây nhỏ gọn, âm thanh rõ và kết nối ổn định.', 32],
  ['shopai-speaker-waterproof', 'Loa Bluetooth mini chống nước', 'Điện tử', 890000, 'photo-1608043152269-423dbba4e7e1', 'Loa di động tiện mang theo khi đi chơi hoặc du lịch.', 21],
  ['shopai-smartwatch-active', 'Đồng hồ thông minh Active', 'Điện tử', 1590000, 'photo-1523275335684-37898b6baf30', 'Theo dõi hoạt động mỗi ngày, xem thông báo ngay trên cổ tay.', 25],
  ['shopai-keyboard-wireless', 'Bàn phím cơ không dây', 'Điện tử', 1890000, 'photo-1587829741301-dc798b83add3', 'Bàn phím gõ êm, kết nối linh hoạt cho góc làm việc.', 14],
  ['shopai-mouse-ergo', 'Chuột không dây công thái học', 'Điện tử', 490000, 'photo-1527814050087-3793815479db', 'Chuột không dây vừa tay, phù hợp làm việc và học tập.', 30],
  ['shopai-charger-usbc-65w', 'Bộ sạc nhanh USB-C 65W', 'Điện tử', 690000, 'photo-1498049794561-7780e7231661', 'Củ sạc công suất cao, thiết kế nhỏ gọn dễ mang theo.', 28],
  ['shopai-windbreaker', 'Áo khoác gió Everyday', 'Thời trang', 890000, 'photo-1551028719-00167b16eac5', 'Áo khoác nhẹ, dễ phối đồ và phù hợp mặc hằng ngày.', 20],
  ['shopai-cotton-tshirt', 'Áo thun cotton basic', 'Thời trang', 299000, 'photo-1521572267360-ee0c2909d518', 'Áo thun cotton mềm, kiểu dáng cơ bản dễ phối.', 40],
  ['shopai-laptop-backpack', 'Balo laptop chống nước 15.6 inch', 'Thời trang', 679000, 'photo-1553062407-98eeb64c6a62', 'Balo nhiều ngăn, có ngăn đệm bảo vệ laptop.', 17],
  ['shopai-running-shoes', 'Giày chạy bộ nhẹ', 'Thời trang', 1190000, 'photo-1542291026-7eec264c27ff', 'Giày thể thao nhẹ, đế bám tốt cho đi bộ và chạy bộ.', 16],
  ['shopai-crossbody-bag', 'Túi đeo chéo đa năng', 'Thời trang', 450000, 'photo-1590874103328-eac38a683ce7', 'Túi gọn nhẹ đựng vật dụng cá nhân khi ra ngoài.', 23],
  ['shopai-unisex-hoodie', 'Áo hoodie nỉ unisex', 'Thời trang', 750000, 'photo-1556821840-3a63f95609a7', 'Áo nỉ mềm, giữ ấm tốt và có kiểu dáng dễ mặc.', 19],
  ['shopai-airfryer-5l', 'Nồi chiên không dầu 5L', 'Nhà cửa', 2190000, 'photo-1585515320310-259814833e62', 'Dung tích phù hợp gia đình, hỗ trợ chế biến món ăn tiện lợi.', 11],
  ['shopai-robot-vacuum', 'Robot hút bụi lau nhà', 'Nhà cửa', 4990000, 'photo-1558317374-067fb5f30001', 'Thiết bị tự động hỗ trợ dọn bụi và giữ sàn nhà sạch hơn.', 7],
  ['shopai-coffee-maker', 'Máy pha cà phê gia đình', 'Nhà cửa', 1690000, 'photo-1495474472287-4d71bcdd2085', 'Máy pha nhỏ gọn cho ly cà phê tại nhà mỗi sáng.', 13],
  ['shopai-electric-kettle', 'Ấm siêu tốc inox 1.7L', 'Nhà cửa', 390000, 'photo-1556679343-c7306c1976bc', 'Ấm đun nước dung tích lớn, tiện sử dụng trong gia đình.', 26],
  ['shopai-personal-blender', 'Máy xay sinh tố cá nhân', 'Nhà cửa', 590000, 'photo-1570222094114-d054a817e56b', 'Máy xay nhỏ gọn để chuẩn bị sinh tố và đồ uống nhanh chóng.', 18],
  ['shopai-cotton-bedding', 'Bộ chăn ga cotton 4 món', 'Nội thất', 1290000, 'photo-1505693416388-ac5ce068fe85', 'Bộ chăn ga chất liệu cotton, màu sắc trang nhã cho phòng ngủ.', 10],
  ['shopai-mesh-office-chair', 'Ghế công thái học lưng lưới', 'Nội thất', 3290000, 'photo-1505843490701-5be5d7b9c59a', 'Ghế lưng lưới thoáng, hỗ trợ tư thế ngồi làm việc.', 6],
  ['shopai-minimal-desk', 'Bàn làm việc tối giản', 'Nội thất', 2190000, 'photo-1497366216548-37526070297c', 'Bàn làm việc gọn gàng, phù hợp căn hộ và góc học tập.', 8],
  ['shopai-led-desk-lamp', 'Đèn bàn LED chống chói', 'Nội thất', 420000, 'photo-1507473885765-e6ed057f782c', 'Đèn bàn điều chỉnh linh hoạt cho góc đọc sách và làm việc.', 22],
  ['shopai-yoga-mat', 'Thảm yoga chống trượt', 'Sức khỏe', 350000, 'photo-1544367567-0f2fcb009e0b', 'Thảm tập êm và bám sàn, phù hợp yoga hoặc giãn cơ tại nhà.', 24],
  ['shopai-smart-scale', 'Cân sức khỏe điện tử', 'Sức khỏe', 490000, 'photo-1571019613454-1cb2f99b2d8b', 'Cân điện tử nhỏ gọn giúp theo dõi cân nặng thường xuyên.', 15],
  ['shopai-hand-massager', 'Súng massage cầm tay', 'Sức khỏe', 1190000, 'photo-1600334129128-685c5582fd35', 'Thiết bị massage cầm tay hỗ trợ thư giãn cơ sau vận động.', 9],
  ['shopai-insulated-bottle', 'Bình giữ nhiệt inox 750ml', 'Sức khỏe', 290000, 'photo-1602143407151-7111542de6e8', 'Bình nước dung tích lớn, tiện mang đi học, làm và tập luyện.', 35],
  ['shopai-resistance-bands', 'Bộ dây kháng lực tập luyện', 'Sức khỏe', 250000, 'photo-1599058917212-d750089bc07b', 'Bộ dây tập gọn nhẹ cho các bài tập tại nhà.', 20],
] as const;

const products = catalog.map(([id, name, category, price, photo, description, inventory]) => ({
  id,
  name,
  category,
  price,
  image: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=900&q=85`,
  description,
  rating: 4.5,
  inventory,
}));

async function main() {
  const email = 'demo@shopai.com';
  const password = await bcrypt.hash('123456', 10);
  await prisma.user.upsert({
    where: { email },
    update: { name: 'ShopAI Demo', password },
    create: { email, name: 'ShopAI Demo', password },
  });
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      create: product,
      update: product,
    });
  }
  console.log(`Seeded ${products.length} ShopAI products.`);
  console.log('Seeded demo user: demo@shopai.com');
}

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
