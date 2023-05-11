import React, { useState } from 'react';
import { FaReact } from 'react-icons/fa';
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import { Divider, Badge, Drawer, message, Avatar } from "antd";
import './header.scss';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { callLogout } from '../../services/api';
import { doLogoutAction } from '../../redux/account/accountSlice';




const Header = () => {

  const [openDrawer, setOpenDrawer] = useState(false);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector(state => state.account.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carts = useSelector(state => state.order.carts)

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success('Đăng xuất thành công');
      navigate('/');
    }
  }

  const items = [
    {
      label: <label style={{ cursor: 'pointer' }}>Quản lý tài khoản</label>,
      key: 'account',
    },

    {
      label: <label
        style={{ cursor: 'pointer' }}
        onClick={() => handleLogout()}
      >Đăng xuất</label>,
      key: 'logout',
    }
  ];

  if (user?.role === 'ADMIN') {
    items.unshift({
      label: <Link to="/admin">Trang quản lý</Link>,
      key: 'admin',
    })
  }

  const urlAvartar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

  return (
    <>
      <div className='header-container'>
        <header className='page-header'>
          <div className='page-header__top'>
            <div className='page-header__toggle' onClick={() => { setOpenDrawer(true) }}>📝</div>
            <div className='page-header__logo'>
              <span onClick={() => navigate('/')} className='logo'>
                <FaReact className='rotate icon-react' /> ABC DEF
                <VscSearchFuzzy className='icon-search' />
              </span>
              <input
                className='input-search' type={'text'}
                placeholder='Bạn cần tìm kiếm...'
              />
            </div>
          </div>
          <nav className='page-header__bottom'>
            <ul id="navigation" className='navigation'>
              <li className='navigation__item'>
                <Badge
                  count={carts?.length ?? 0}
                  size={"small"}
                  showZero
                ><FiShoppingCart className='icon-cart' /></Badge>
              </li>
              <li className='navigation__item moblie'><Divider type='vertical' /></li>
              <li className='navigation__item moblie'>
                {!isAuthenticated ?
                  <span onClick={() => navigate('/login')}>Tài khoản</span>
                  :
                  <Dropdown menu={{ items }} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <Avatar src={urlAvartar} />
                        {user?.fullName}
                      </Space>
                    </a>
                  </Dropdown>
                }
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement='left'
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p>Quản lý tài khoản</p>
        <Divider />

        <p>Đăng xuất</p>
        <Divider />
      </Drawer>

    </>
  )
};

export default Header
