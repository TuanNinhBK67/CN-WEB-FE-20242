export const handleSearch = async (
    keyword,
    setSearchKeyword,
    setSearchResults
) => {
    if (!keyword) return;
    setSearchKeyword(keyword);
    try {
        const response = await fetch(
            `http://localhost:8080/api/products/search?keyword=${encodeURIComponent(
                keyword
            )}`
        );
        if (!response.ok) {
            throw new Error("Lỗi khi gọi API");
        }
        const data = await response.json();
        setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        setSearchResults([]);
    }
};
