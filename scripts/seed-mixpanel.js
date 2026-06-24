import fs from 'fs';
import path from 'path';

// Đọc token từ file .env
const envPath = path.resolve(process.cwd(), '.env');
let mixpanelToken = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/VITE_MIXPANEL_TOKEN\s*=\s*(.+)/);
  if (match && match[1]) {
    mixpanelToken = match[1].trim();
  }
}

if (!mixpanelToken) {
  console.error('❌ Không tìm thấy VITE_MIXPANEL_TOKEN trong file .env');
  process.exit(1);
}

console.log(`🚀 Bắt đầu sinh Mock Data gửi tới Mixpanel (Token: ${mixpanelToken.slice(0, 6)}...)`);

// Cấu hình sinh data
const EVENTS_COUNT = 150; // Tổng số sự kiện mock
const USER_COUNT = 25;    // Số lượng user giả lập

// Danh sách các thông tin giả lập
const NAMES = [
  'Nguyễn Văn An',
  'Trần Thị Bình',
  'Lê Hoàng Cường',
  'Phạm Minh Duy',
  'Nguyễn Thị Hải Yến',
  'Đặng Văn Phong',
  'Hoàng Gia Bảo',
  'Vũ Khánh Huy',
  'Bùi Đức Trí',
  'Đỗ Thảo Khanh'
];
const DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'fpt.edu.vn'];
const PRODUCTS = [
  { id: 'prod-tshirt-001', name: 'V-TRY Slim-Fit T-Shirt', category: 'Tops', price: 89 },
  { id: 'prod-jeans-002', name: 'V-TRY Classic Denim Jeans', category: 'Bottoms', price: 149 },
  { id: 'prod-jacket-003', name: 'V-TRY Bomber Jacket', category: 'Outerwear', price: 299 },
  { id: 'prod-hoodie-004', name: 'V-TRY Oversized Hoodie', category: 'Tops', price: 179 }
];
const COLORS = [
  { name: 'Classic Black', hex: '#000000' },
  { name: 'Navy Blue', hex: '#1B4F72' },
  { name: 'Crimson Red', hex: '#922B21' },
  { name: 'Olive Green', hex: '#1E8449' },
  { name: 'Pure White', hex: '#FFFFFF' }
];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// 1. Tạo danh sách Users giả lập
const mockUsers = Array.from({ length: USER_COUNT }, (_, index) => {
  const name = NAMES[index % NAMES.length] + ' ' + (Math.floor(index / NAMES.length) || '');
  const email = `${name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '')}${index}@${DOMAINS[index % DOMAINS.length]}`;
  return {
    userId: `user_mock_${1000 + index}`,
    displayName: name.trim(),
    email: email
  };
});

// 2. Tạo danh sách các event ngẫu nhiên trong vòng 5 ngày qua
const events = [];
const nowMs = Date.now();
const fiveDaysAgoMs = nowMs - 5 * 24 * 60 * 60 * 1000;

for (let i = 0; i < EVENTS_COUNT; i++) {
  // Chọn ngẫu nhiên user và thời gian
  const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  const timestampMs = Math.floor(fiveDaysAgoMs + Math.random() * (nowMs - fiveDaysAgoMs));
  const timestampSec = Math.floor(timestampMs / 1000);

  // Chọn ngẫu nhiên sản phẩm
  const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const size = SIZES[Math.floor(Math.random() * SIZES.length)];

  // Giai đoạn phễu (funnel steps) của user
  // 1. Page View (luôn xảy ra)
  events.push({
    event: '$mp_web_page_view', // Event mặc định của Mixpanel
    properties: {
      token: mixpanelToken,
      distinct_id: user.userId,
      time: timestampSec,
      $current_url: 'https://v-try.vercel.app/',
      platform: 'web',
      app_version: '1.0.0'
    }
  });

  // 2. Xem sản phẩm cụ thể
  events.push({
    event: 'Product Viewed',
    properties: {
      token: mixpanelToken,
      distinct_id: user.userId,
      time: timestampSec + 5, // Trễ 5 giây
      product_id: product.id,
      product_name: product.name,
      product_category: product.category,
      product_price: product.price,
      platform: 'web'
    }
  });

  // Tỉ lệ tương tác Try-on (70%)
  if (Math.random() < 0.7) {
    events.push({
      event: 'Virtual Try-On Clicked',
      properties: {
        token: mixpanelToken,
        distinct_id: user.userId,
        time: timestampSec + 20, // Trễ 20 giây
        product_id: product.id,
        product_name: product.name,
        product_category: product.category,
        product_price: product.price,
        selected_color: color.name,
        selected_size: size,
        action: 'try_on',
        is_authenticated: Math.random() > 0.5,
        platform: 'web'
      }
    });

    // Thay đổi màu sắc/size (50%)
    if (Math.random() < 0.5) {
      const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      events.push({
        event: 'Color Selected',
        properties: {
          token: mixpanelToken,
          distinct_id: user.userId,
          time: timestampSec + 35,
          product_id: product.id,
          product_name: product.name,
          color_name: newColor.name,
          color_hex: newColor.hex,
          platform: 'web'
        }
      });
    }

    // AI gợi ý size (40%)
    if (Math.random() < 0.4) {
      const height = Math.floor(Math.random() * (190 - 150) + 150);
      const weight = Math.floor(Math.random() * (90 - 45) + 45);

      events.push({
        event: 'Size Suggestion Submitted',
        properties: {
          token: mixpanelToken,
          distinct_id: user.userId,
          time: timestampSec + 50,
          product_id: product.id,
          product_name: product.name,
          height_cm: height,
          weight_kg: weight,
          platform: 'web'
        }
      });

      events.push({
        event: 'Size Suggestion Result Received',
        properties: {
          token: mixpanelToken,
          distinct_id: user.userId,
          time: timestampSec + 52,
          product_id: product.id,
          product_name: product.name,
          suggested_size: SIZES[Math.floor(Math.random() * SIZES.length)],
          confidence: parseFloat((Math.random() * (1.0 - 0.7) + 0.7).toFixed(2)),
          platform: 'web'
        }
      });
    }

    // Thêm vào giỏ hàng Add to Cart (30%)
    if (Math.random() < 0.3) {
      events.push({
        event: 'Add to Cart',
        properties: {
          token: mixpanelToken,
          distinct_id: user.userId,
          time: timestampSec + 70,
          product_id: product.id,
          product_name: product.name,
          product_category: product.category,
          product_price: product.price,
          selected_size: size,
          selected_color: color.name,
          quantity: 1,
          platform: 'web'
        }
      });
    }
  }
}

// 3. Hàm gửi profile data lên Mixpanel People
async function sendUserProfiles() {
  console.log(`👥 Đang gửi profile của ${mockUsers.length} user lên Mixpanel...`);
  const profilePayloads = mockUsers.map(user => ({
    $token: mixpanelToken,
    $distinct_id: user.userId,
    $set: {
      $name: user.displayName,
      $email: user.email,
      'Mock Account': true
    }
  }));

  try {
    const res = await fetch('https://api.mixpanel.com/engage#profile-set', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain'
      },
      body: JSON.stringify(profilePayloads)
    });
    const resultText = await res.text();
    console.log(`✅ Kết quả gửi Profiles: ${resultText === '1' ? 'Thành công (1)' : resultText}`);
  } catch (error) {
    console.error('❌ Lỗi khi gửi User Profiles:', error);
  }
}

// 4. Hàm gửi sự kiện theo cụm (batch)
async function sendEventsInBatches() {
  // Chia nhỏ array events ra thành các cụm 50 items (Mixpanel giới hạn kích thước payload)
  const batchSize = 50;
  console.log(`📊 Đang gửi ${events.length} sự kiện giả lập (độ tuổi trong vòng 5 ngày qua)...`);

  for (let i = 0; i < events.length; i += batchSize) {
    const batch = events.slice(i, i + batchSize);
    try {
      const res = await fetch('https://api.mixpanel.com/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain'
        },
        body: JSON.stringify(batch)
      });
      const resultText = await res.text();
      console.log(`   👉 Đang gửi cụm ${Math.floor(i / batchSize) + 1}... ${resultText === '1' ? 'Thành công' : 'Thất bại: ' + resultText}`);
    } catch (error) {
      console.error(`❌ Lỗi khi gửi cụm ${Math.floor(i / batchSize) + 1}:`, error);
    }
  }
}

// Chạy tiến trình seeding
async function run() {
  await sendUserProfiles();
  await sendEventsInBatches();
  console.log('\n🎉 Hoàn thành seeding Mock Data! Hãy kiểm tra Live View trên dashboard Mixpanel của bạn.');
}

run();
