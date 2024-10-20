import Banner from '../Banner';
import Header from './Header';

function Layout({ children }) {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <Banner />
      <main className='h-full'>{children}</main>
    </div>
  );
}

export default Layout;
