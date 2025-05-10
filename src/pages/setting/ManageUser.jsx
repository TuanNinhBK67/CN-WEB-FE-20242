import React, { useEffect, useState } from "react";
import { getAllUsers, banUser, deleteUser, unbanUser } from "../../services/userService";
import "../../assets/scss/setting/ManageUser.scss";
import { LuUserCheck, LuUserX , LuUsers  } from "react-icons/lu";

const UserManagement = () => {
  const [data, setData] = useState({ users: [], activeUser: 0, bannedUser: 0 });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setData(res.data.data);
      } catch (err) {
        setError("Không thể tải danh sách người dùng.");
      }
    };
    fetchUsers();
  }, []);

  const totalPages = Math.ceil(data.users.length / usersPerPage);
  const currentUsers = data.users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleBlock = async(userId) => {

    try {
        await banUser(userId);
        alert("Đã chặn người dùng.");
        window.location.reload(); // reload để cập nhật danh sách
    } catch (error) {
        alert("Chặn người dùng thất bại.");
    }
  };

  const handleUnBlock = async(userId) => {
    try{
      await unbanUser(userId);
      alert("Đã gỡ chặn thành công");
      window.location.reload();
    }catch(error){
      alert("Bỏ chặn thất bại.");
    }
  }

  const handleDelete = async(userId) => {
    try {
        await deleteUser(userId);
        alert("Đã xóa người dùng.");
        window.location.reload(); // reload để cập nhật danh sách
    } catch (error) {
        alert("Xóa người dùng thất bại.");
    }
  };

  return (
    <div className="user-management-wrapper">
      <h2 className="user-management-title">Quản lý người dùng</h2>

      {error && <p className="error">{error}</p>}

      <div className="user-summary">
        <span><LuUserCheck/> Đang hoạt động: {data.activeUser}</span>
        <span><LuUserX/> Đã bị chặn: {data.bannedUser}</span>
        <span><LuUsers/> Tổng người dùng: {data.users.length}</span>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Tên đăng nhập</th>
            <th>Họ và tên</th>
            <th>Giới tính</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Địa chỉ</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.full_name}</td>
              <td>{user.gender === "male" ? "Nam" : user.gender === "female" ? "Nữ" : "Khác"}</td>
              <td>{user.email}</td>
              <td>{user.phone_number}</td>
              <td>{user.address}</td>
              <td>{user.role === "admin" ? "Quản trị viên" : user.role === "shipper" ? "Người giao hàng": "Khách hàng"}</td>
              <td>{user.status === "banned" ? "Bị chặn" : "Hoạt động"}
                {user.status === "banned" && (
                    <button onClick={() => handleUnBlock(user.id)} className="unban">Bỏ Chặn</button>
                )}
              </td>
              <td>
                <button onClick={() => handleBlock(user.id)}>Chặn</button>
                <button onClick={() => handleDelete(user.id)} className="delete">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;