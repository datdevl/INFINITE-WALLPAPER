# INFINITE WALLPAPER — ZERO API KEY

Website trình chiếu ảnh và video lấy trực tiếp từ các nguồn mở. Không cần đăng ký tài khoản, không nhập API key, không cần backend cho phiên bản cơ bản.

## Nguồn nội dung
- **Wikimedia Commons**: MediaWiki Action API, CORS với `origin=*`, phân trang continuation. Tìm ảnh và video theo chủ đề. Từng tệp có giấy phép/tác giả riêng; giao diện hiển thị credit và link trang tệp.
- **NASA Image and Video Library**: `https://images-api.nasa.gov/search`, hỗ trợ tìm ảnh/video; endpoint tài sản `/asset/{nasa_id}` lấy danh sách file. Không cần API key theo tài liệu NASA Image and Video Library.
- **Lorem Picsum**: `/v2/list?page=N&limit=50` và ảnh theo ID làm nguồn ảnh bổ sung. Không phải kho ảnh 4K chuyên dụng; kích thước ảnh gốc thay đổi.

## Chạy thử
Mở thư mục bằng VS Code, chạy Live Server hoặc:
```bash
python -m http.server 8000
```
Truy cập http://localhost:8000

Không nên mở trực tiếp `file://` vì trình duyệt có thể chặn ES modules/fetch.

## GitHub Pages
1. Upload toàn bộ nội dung thư mục lên repository, nhánh `main`.
2. Settings → Pages → Deploy from a branch.
3. Chọn `main` và `/ (root)`, Save.
4. Mở URL Pages sau khi deploy hoàn tất.

## Lưu ý quan trọng
- “Không API key” không có nghĩa là không có API: website gọi các API công khai không yêu cầu khóa.
- Không có bảo đảm vô hạn ảnh mới, 4K thật, uptime hoặc không bị rate-limit. API có thể thay đổi/chặn request; URL nguồn có thể ngừng hoạt động.
- Video từ Commons có thể là WebM/OGV; hỗ trợ phát phụ thuộc trình duyệt và codec. NASA có video MP4 nhưng không phải item nào cũng có file video dùng được.
- Kích thước pixel được hiển thị khi API cung cấp. Không upscale và không gọi ảnh nhỏ là 4K.
- Wikimedia Commons yêu cầu tuân thủ giấy phép của từng tệp (ví dụ attribution, share-alike). Hãy mở trang nguồn và xác minh thông tin cấp phép trước khi dùng lại.
- NASA media generally may be reused subject to NASA Media Usage Guidelines, nhưng một số tài sản bên thứ ba có bản quyền; không dùng logo NASA hoặc ngụ ý NASA chứng thực website.
- Website chỉ hiển thị/hotlink nội dung từ nhà cung cấp; không tải và lưu media vào GitHub repository. Kiểm tra điều khoản hotlinking và giấy phép theo từng nguồn.
- Chế độ này lọc ID trùng trong phiên trình duyệt và lấy thêm trang khi gần hết hàng đợi. Khi API đã hết kết quả hoặc không phản hồi, app sẽ báo trạng thái thay vì giả vờ có ảnh mới vô hạn.

## Tài liệu chính thức
- Wikimedia API CORS: https://www.mediawiki.org/wiki/API:Cross-site_requests
- Wikimedia reuse: https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
- NASA Image and Video Library API: https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf
- NASA Media Usage Guidelines: https://www.nasa.gov/nasa-brand-center/images-and-media/
- Picsum: https://picsum.photos/
