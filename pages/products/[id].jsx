/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import ContentLoader from 'react-content-loader';
// import jwtDecode from 'jwt-decode';
// import Cookies from 'js-cookie';
import Img from '../../components/img/Img';
import Start from '../../components/star/start';
import Color from '../../components/molecules/color';
import SpinnerAction from '../../components/molecules/spinner';
import FormValueNumber from '../../components/form/form-addvalue';
import ButtonSuccess from '../../components/Button/button-success';
import ButtonWarning from '../../components/Button/button-warning';
import FormInformation from '../../components/form/form-information';
import CardProducts from '../../components/card/card-products';
import { getDetailProduct, getPopularProducts } from '../../redux/actions/products';
import { addCart, getMyCart } from '../../redux/actions/cart';
import { chat } from '../../redux/actions/chat';
import { createTransaction } from '../../redux/actions/transaction';
import { toastify } from '../../utils/toastify';

const Products = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const [getColor, setColor] = useState('');
  const [getSize, setSize] = useState(0);
  const [getAmount, setAmount] = useState(0);

  useEffect(() => {
    dispatch(getDetailProduct(id));
    dispatch(getPopularProducts());
    dispatch(getMyCart());
  }, []);

  // eslint-disable-next-line no-unused-vars
  const myCart = useSelector(state => {
    return state.myCart;
  });

  const getPopular = useSelector(state => {
    return state.getPopular;
  });

  const getDetail = useSelector(state => {
    return state.getDetailProduct;
  });

  const onSize = e => {
    if (getSize <= 0 && e === -1) {
      setSize(0);
    } else if (getSize >= 10 && e === 1) {
      setSize(10);
    } else {
      setSize(getSize + e);
    }
  };

  const onBuy = async e => {
    try {
      const data = {
        product_id: e,
        qty: getAmount,
        color: getColor,
        id: ''
      };
      if (data.qty === '' || data.qty === 0) {
        Swal.fire({
          title: 'Failed!',
          text: 'Number of items must be filled!',
          icon: 'error'
        });
      } else {
        addCart(data)
          .then(res => {
            Swal.fire({
              title: 'Success!',
              text: res.message,
              icon: 'success'
            });
            dispatch(getMyCart());
          })
          .catch(err => {
            Swal.fire({
              title: 'Failed!',
              text: err.message,
              icon: 'error'
            });
          });
      }
    } catch (error) {
      Swal.fire({
        title: 'Failed!',
        text: error.message,
        icon: 'error'
      });
    }
  };

  const onAmount = e => {
    if (getAmount <= 0 && e === -1) {
      setAmount(0);
    } else if (getAmount >= getDetail.data.product.stock && e === 1) {
      setAmount(getDetail.data.product.stock);
    } else {
      setAmount(getAmount + e);
    }
  };

  const onDetail = e => {
    dispatch(getDetailProduct(e));
    router.push(`/products/${e}`);
  };

  const initialChat = e => {
    // const decoded = jwtDecode(Cookies.get('token'));
    e.preventDefault();

    chat({})
      .then(() => {
        router.push('/chat');
      })
      .catch(error => {
        Swal.fire({
          title: 'Error!',
          text: error.response.data.message,
          icon: 'error'
        });
      });
  };

  const handleBuyNow = e => {
    e.preventDefault();

    createTransaction({
      productId: getDetail.data.product.id,
      qty: getAmount,
      isBuy: 1
    })
      .then(res => {
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success'
        });
        router.push('/checkout');
      })
      .catch(err => {
        if (err.response.data.code === 422) {
          const { error } = err.response.data;
          error.map(item => toastify(item, 'error'));
        } else {
          Swal.fire({
            title: 'Error!',
            text: err.response.data.message,
            icon: 'error'
          });
        }
      });
  };

  return (
    <div>
      <Head>
        <title>Blanja | Products</title>
        <meta name="" content="" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className="p-6 pt-28 md:p-28 bg-white">
        <div>
          <ul className="flex text-gray text-sm font-bold w-56 justify-between">
            <Link href="/">
              <li className="cursor-pointer">Home</li>
            </Link>
            <li>{'>'} </li>
            <Link href="/category">
              <li className="cursor-pointer">category</li>
            </Link>
            <li>{'>'} </li>
            {getDetail.data.category ? (
              <li className="cursor-pointer">
                {getDetail.data.category ? getDetail.data.category[0].category_name : null}
              </li>
            ) : null}
          </ul>
        </div>
        {getDetail.data.length >= 0 ? (
          <></>
        ) : (
          <div>
            <div className="md:flex mt-12">
              <div
                className="md:w-2/5 bg-secondary grid-cols-2
                     grid-flow-row gap-4 auto-rows-auto"
              >
                <div
                  className="grid grid-cols-2
                     grid-flow-row gap-4 auto-rows-auto"
                >
                  <Img
                    src={
                      getDetail.data.image.length >= 0
                        ? `https://drive.google.com/uc?export=view&id=${
                            getDetail.data.image[0] ? getDetail.data.image[0].photo : 'default.png'
                          }`
                        : 'https://drive.google.com/uc?export=view&id=default.png'
                    }
                  />
                  <Img
                    src={
                      getDetail.data.image.length >= 0
                        ? `https://drive.google.com/uc?export=view&id=${
                            getDetail.data.image[1] ? getDetail.data.image[1].photo : 'default.png'
                          }`
                        : 'https://drive.google.com/uc?export=view&id=default.png'
                    }
                  />
                  <Img
                    src={
                      getDetail.data.image.length >= 0
                        ? `https://drive.google.com/uc?export=view&id=${
                            getDetail.data.image[2] ? getDetail.data.image[2].photo : 'default.png'
                          }`
                        : 'https://drive.google.com/uc?export=view&id=default.png'
                    }
                  />
                  <Img
                    src={
                      getDetail.data.image.length >= 0
                        ? `https://drive.google.com/uc?export=view&id=${
                            getDetail.data.image[3] ? getDetail.data.image[3].photo : 'default.png'
                          }`
                        : 'https://drive.google.com/uc?export=view&id=default.png'
                    }
                  />
                </div>
              </div>
              <div className="flex-auto md:w-3/5 bg-tertiary md:pl-9 md:pr-7 mt-5 md:mt-0">
                <div>
                  <h3 className="text-2xl font-bold">
                    {getDetail.data.category ? getDetail.data.product.product_name : null}
                  </h3>
                  {getDetail.data.category.length > 0 ? (
                    <div className="flex">
                      <p className="text-gray text-sm font-semibold">{getDetail.data.brand[0].brand_name}</p>
                      <p className="text-sm text-gray ml-2">|</p>
                      <p className="text-sm text-gray ml-2"> {getDetail.data.product.stock} stock</p>
                    </div>
                  ) : null}

                  <Start valueReview="(10)" />
                </div>
                <div className="mt-5">
                  <p className="text-md text-gray font-semibold text-sm">Price</p>
                  <h3 className="text-dark text-xl font-extrabold">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(getDetail.data.product.price)}
                    {/* {getDetail.data.category ? getDetail.data.product.price : null} */}
                  </h3>
                </div>
                <div className="mt-5">
                  <p className="font-semibold text-md">Color</p>
                  <div className="flex w-44 p-1 justify-between">
                    {getDetail.data.color.map((item, index) => (
                      <div key={index}>
                        <Color color={`${item.color_name}`.toLowerCase()} onClick={() => setColor(item.color_name)} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between w-full md:w-72 mt-5">
                  <div className="relative">
                    <p className="font-bold text-base">Size</p>
                    <div className=" flex w-28 items-center justify-between">
                      <SpinnerAction action="+" onClick={() => onSize(+1)} />
                      <FormValueNumber defaultValue={getSize} value={getSize} />
                      <SpinnerAction action="-" onClick={() => onSize(-1)} />
                    </div>
                  </div>
                  <div className="relative">
                    <p className="font-bold text-base">Jumlah</p>
                    <div className="flex w-8 items-center justify-between">
                      <SpinnerAction action="+" onClick={() => onAmount(+1)} />
                      <FormValueNumber defaultValue={getDetail.data.product.stock} value={getAmount} />
                      <SpinnerAction action="-" onClick={() => onAmount(-1)} />
                    </div>
                  </div>
                </div>
                <div className="mt-8 md:mt-5 md:w-80">
                  <div className="flex justify-between mt-5">
                    <ButtonSuccess onClick={initialChat} action="Chat" />
                    <ButtonSuccess onClick={() => onBuy(getDetail.data.product.id)} action="Add bag" />
                  </div>
                  <div className="mt-5">
                    <ButtonWarning action="Buy Now" onClick={handleBuyNow} />
                  </div>
                </div>
              </div>
            </div>
            <FormInformation
              condition={getDetail.data.product.is_new === 1 ? 'New' : 'Old'}
              description={getDetail.data.product.description}
            />
          </div>
        )}

        <hr className="text-gray mt-7" />
        <h1 className="mt-8 text-black text-3xl font-extrabold">You can also like this</h1>
        <p className="text-gray">You’ve never seen it before!</p>
        <div
          className="w-content bg-secondary grid-cols-2
                     grid-flow-row gap-4 auto-rows-auto"
        >
          <div
            className="md:grid grid-cols-5
                     grid-flow-row gap-4 auto-rows-auto"
          >
            {getPopular.isLoading ? (
              <ContentLoader />
            ) : (
              getPopular.data.map((item, index) => (
                <div key={index}>
                  <CardProducts
                    nameProduct={`${item.product.product_name}`}
                    price={new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(item.product.price)}
                    user={`${item.store[0].store_name}`}
                    onClick={() => onDetail(item.product.id)}
                    img={`${
                      item.image.length >= 0
                        ? `https://drive.google.com/uc?export=view&id=${
                            item.image[0] ? item.image[0].photo : 'default.png'
                          }`
                        : `https://drive.google.com/uc?export=view&id=
                        default.png`
                    }`}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Products.layouts = 'MainLayout';

export default Products;
