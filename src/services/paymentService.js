import axios from 'axios';

// URL cơ sở cho API backend (điều chỉnh nếu backend chạy trên host/port khác)
const API_BASE_URL = 'http://localhost:3000/api/payments';

// Tạo một instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Dịch vụ xử lý các yêu cầu API liên quan đến thanh toán
 */
const PaymentService = {
  /**
   * Xử lý thanh toán cho một đơn hàng
   * @param {Object} paymentData - Dữ liệu thanh toán
   * @param {string} paymentData.order_id - ID đơn hàng
   * @param {string} paymentData.user_id - ID người dùng
   * @param {string} paymentData.payment_method - Phương thức thanh toán (ví dụ: 'credit_card', 'paypal')
   * @returns {Promise<Object>} Kết quả thanh toán
   */
  async processPayment(paymentData) {
    try {
      const response = await apiClient.post('/process', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể xử lý thanh toán');
    }
  },

  /**
   * Hủy thanh toán cho một đơn hàng
   * @param {string} orderId - ID đơn hàng
   * @returns {Promise<Object>} Kết quả hủy thanh toán
   */
  async cancelPayment(orderId) {
    try {
      const response = await apiClient.post('/cancel', { order_id: orderId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể hủy thanh toán');
    }
  },

  /**
   * Xác nhận thanh toán hoàn tất
   * @param {string} orderId - ID đơn hàng
   * @param {string} transactionId - ID giao dịch
   * @returns {Promise<Object>} Kết quả xác nhận
   */
  async confirmPayment(orderId, transactionId) {
    try {
      const response = await apiClient.get('/confirm', {
        params: { order_id: orderId, transaction_id: transactionId },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể xác nhận thanh toán');
    }
  },

  /**
   * Lấy chi tiết hóa đơn
   * @param {string} invoiceId - ID hóa đơn
   * @returns {Promise<Object>} Chi tiết hóa đơn
   */
  async getInvoice(invoiceId) {
    try {
      const response = await apiClient.get(`/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin hóa đơn');
    }
  },

  /**
   * Lấy danh sách tất cả giao dịch thanh toán của người dùng
   * @param {number} userId - ID người dùng
   * @returns {Promise<Object>} Danh sách giao dịch
   */
  async getAllPayments(userId) {
    try {
      const response = await apiClient.get('/', {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách thanh toán');
    }
  },

  /**
   * Tạo một giao dịch thanh toán mới
   * @param {Object} paymentData - Dữ liệu thanh toán
   * @param {string} paymentData.order_id - ID đơn hàng
   * @param {string} paymentData.user_id - ID người dùng
   * @param {number} paymentData.amount - Số tiền thanh toán
   * @param {string} paymentData.payment_method - Phương thức thanh toán
   * @returns {Promise<Object>} Thông tin giao dịch mới
   */
  async createPayment(paymentData) {
    try {
      const response = await apiClient.post('/create', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tạo giao dịch thanh toán');
    }
  },

  /**
   * Kiểm tra trạng thái thanh toán của đơn hàng
   * @param {string} orderId - ID đơn hàng
   * @returns {Promise<Object>} Trạng thái thanh toán
   */
  async checkPaymentStatus(orderId) {
    try {
      const response = await apiClient.get(`/status/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể kiểm tra trạng thái thanh toán');
    }
  },

  /**
   * Yêu cầu hoàn tiền cho một đơn hàng
   * @param {string} orderId - ID đơn hàng
   * @param {string} [reason] - Lý do hoàn tiền (không bắt buộc)
   * @returns {Promise<Object>} Kết quả hoàn tiền
   */
  async refundPayment(orderId, reason = '') {
    try {
      const response = await apiClient.post('/refund', { order_id: orderId, reason });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể xử lý hoàn tiền');
    }
  },
};

export default PaymentService;