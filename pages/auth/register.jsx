import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { toastify } from '../../utils/toastify';
import { sweetAlert } from '../../utils/sweetalert';
import { registerBuyer, registerSeller } from '../../redux/actions/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import logoAuth from '../../public/logoAuth.png';

export default function index() {
  const router = useRouter();
  const [formShow, setFormShow] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const initialState = {
    name: '',
    email: '',
    password: '',
    store_name: '',
    store_phone: ''
  };
  const [form, setForm] = useState(initialState);

  const setCurrentShow = index => {
    setForm({
      name: '',
      email: '',
      password: '',
      store_name: '',
      store_phone: ''
    });
    setFormShow(index);
  };

  const { name, email, password, store_name, store_phone } = form;

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmitCustomer = e => {
    e.preventDefault();
    if (!name || !email || !password) {
      sweetAlert('All field must be filled!', 'error');
    } else {
      setIsLoading(true);
      registerBuyer({
        name,
        email,
        password
      })
        .then(res => {
          router.push('/auth/login');
          sweetAlert(res.message);
        })
        .catch(err => {
		  if (err.response && err.response.data && err.response.data.code === 422) {
			const { error } = err.response.data;
			error.map(e => toastify(e, 'error'));
		  } else if (err.response && err.response.data) {
			sweetAlert(err.response.data.message, 'error');
		  } else {
			sweetAlert('An unexpected error occurred.', 'error');
		  }
		})
        .finally(() => {
          setIsLoading(false);
          setForm({
            name: '',
            email: '',
            password: '',
            store_name: '',
            store_phone: ''
          });
        });
    }
  };

  const handleSubmitSeller = e => {
    e.preventDefault();
    if (!name || !email || !password || !store_name || !store_phone) {
      sweetAlert('All field must be filled!', 'error');
    } else {
      setIsLoading(true);
      registerSeller({
        name,
        email,
        store_name,
        store_phone,
        password
      })
        .then(res => {
          router.push('/auth/login');
          sweetAlert(res.message);
        })
		.catch(err => {
		  if (err.response && err.response.data && err.response.data.code === 422) {
			const { error } = err.response.data;
			error.map(e => toastify(e, 'error'));
		  } else if (err.response && err.response.data) {
			sweetAlert(err.response.data.message, 'error');
		  } else {
			sweetAlert('An unexpected error occurred.', 'error');
		  }
		})
        .finally(() => {
          setIsLoading(false);
          setForm({
            name: '',
            email: '',
            password: '',
            store_name: '',
            store_phone: ''
          });
        });
    }
  };

  return (
    <div className="flex min-h-screen">
      <Head>
        <title>Blanja | Register</title>
        <meta name="" content="" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className="sm:w-full md:w-2/6 border-slate-200 rounded-xl mx-auto p-5 flex flex-col items-center relative">
        <Image src={logoAuth} width={150} height={60} objectFit="center" layout="fixed" />
        <label className="font-bold mt-4">Please login with your account</label>
        {formShow === 0 ? (
          <div className="flex w-[230px] flex-row my-8">
            <button
              onClick={() => setCurrentShow(0)}
              className="border-solid-gray border-[1px] rounded w-full h-12 bg-primary text-white"
            >
              Customer
            </button>
            <button
              onClick={() => setCurrentShow(1)}
              className="border-solid-gray border-[1px] rounded text-gray w-full h-12 "
            >
              Seller
            </button>
          </div>
        ) : (
          <div className="flex w-[230px] flex-row my-8">
            <button
              onClick={() => setCurrentShow(0)}
              className="border-solid-gray border-[1px] rounded text-gray w-full h-12"
            >
              Customer
            </button>
            <button
              onClick={() => setCurrentShow(1)}
              className="border-solid-gray border-[1px] rounded w-full h-12 bg-primary text-white"
            >
              Seller
            </button>
          </div>
        )}
        {formShow === 0 ? (
          <form className="w-full" onSubmit={handleSubmitCustomer}>
            <Input placeholder="Name" id="name" type="text" value={name} onChange={handleChange} />
            <Input placeholder="Email" id="email" type="email" value={email} onChange={handleChange} />
            <Input placeholder="Password" id="password" type="password" value={password} onChange={handleChange} />
            {isLoading ? <Button disabled="disabled" name="Loading" /> : <Button name="Register" type="submit" />}
            <label className="ml-2 sm:ml-2 md:ml-12 lg:ml-12 mr-2">Already have a Tokopedia account?</label>
            <Link href="/auth/login" className="text-special-warning">
              Login
            </Link>
          </form>
        ) : (
          <form className="w-full" onSubmit={handleSubmitSeller}>
            <Input placeholder="Name" id="name" type="text" value={name} onChange={handleChange} />
            <Input placeholder="Email" id="email" type="email" value={email} onChange={handleChange} />
            <Input placeholder="Phone" id="store_phone" type="text" value={store_phone} onChange={handleChange} />
            <Input placeholder="Store name" id="store_name" type="text" value={store_name} onChange={handleChange} />
            <Input placeholder="Password" id="password" type="password" value={password} onChange={handleChange} />
            {isLoading ? <Button disabled="disabled" name="Loading" /> : <Button name="Register" type="submit" />}
            <label className="ml-2 sm:ml-2 md:ml-12 lg:ml-12 mr-2">Already have a Tokopedia account?</label>
            <Link href="/auth/login" className="text-special-warning">
              Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
