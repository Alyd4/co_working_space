import Pinvert from '../assets/pin_vert.png'; // Adjust the path to where your paperclip image is stored
import Website from '../assets/web2.png'; // Adjust the path to where your workshop image is stored
import Vest from '../assets/Vest2.png'; // Adjust the path to where your content writer image is stored
import Report from '../assets/reporttomis.png'; // Adjust the path to where your form application image is stored
import Nametag from '../assets/nametag.png';
import Bengkulu from '../assets/logo pkbi_BENGKULU.png';
import DKI from '../assets/logo pkbi_DKI.png';
import Jambi from '../assets/logo pkbi_JAMBI.png';
import Riau from '../assets/logo pkbi_RIAU.png';

const Popular = () => {
  return (
    <div className='m-5 md:m-20'>
      <h1 className='text-2xl md:text-3xl font-bold text-blue-500 w-full md:w-[50%]'>
        Kami Menciptakan Produk Digital maupun layanan untuk Komunitas anda
      </h1>
      <p className='text-lg md:text-xl my-2'>
        Platform Penjualan Produk dan Layanan Ruang Kerja Virtual untuk Komunitas
      </p>

      <div className='grid grid-cols- md:grid-cols-2 gap-4 mt-10'>
        {/* Left side */}
        <div className='col-span-1 h-full'>
          <img className='w-[20%] md:w-[10%] absolute left-12 md:left-19 top-[133%] md:top-[140%] transform -translate-y-1/2' src={Pinvert} alt="Pinvert" />
          <div className='bg-blue-100 rounded-2xl p-10 flex justify-center items-center h-[590px] md:h-[590px]'>
            <img className='w-[90%] md:w-[60%]' src={Website} alt="Website design" />
          </div>
          <h1 className='text-2xl md:text-3xl font-bold text-blue-500 w-full my-4'>
            Web Design
          </h1>
          <p className='text-sm md:text-base font-semibold w-full'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut....
          </p>
        </div>

        {/* Right side */}
        <div className='col-span-1 flex flex-col space-y-4'>
          <div className='flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0'>
            <div className='flex flex-col w-full'>
              <div className='bg-blue-100 rounded-2xl p-2 flex justify-center items-center  h-[200px] md:h-[200px]'>
                <img className='w-[75%] md:w-[50%]' src={Vest} alt="" />
              </div>
              <div className='mt-2'>
                <h1 className='text-lg md:text-xl font-bold text-blue-500 w-full md:w-[100%] my-2'>Vest</h1>
                <p className='text-xs md:text-sm font-semibold my-1 w-full md:w-[100%]'>Kami Menciptakan Produk Digital maupun layanan untuk Komunitas anda</p>
              </div>
            </div>

            <div className='flex flex-col w-full'>
              <div className='bg-blue-100 rounded-2xl p-2 flex justify-center items-center  h-[200px] md:h-[200px]'>
                <img className='w-[75%] md:w-[50%]' src={Report} alt="" />
              </div>
              <div className='mt-2'>
                <h1 className='text-lg md:text-xl font-bold text-blue-500 w-full md:w-[100%] my-2'>Aplikasi Pelaporan</h1>
                <p className='text-xs md:text-sm font-semibold my-1 w-full md:w-[100%]'>Kami Menciptakan Produk Digital maupun layanan untuk Komunitas anda</p>
              </div>
            </div>
          </div>

          <div className='col-span-1'>
            <div className='bg-blue-100 rounded-2xl p-5 flex justify-center items-center'>
              <img className='w-[75%] md:w-[50%]' src={Nametag} alt="" />
            </div>
            <h1 className='text-xl md:text-2xl font-bold text-blue-500 w-full md:w-[100%] my-2'>Design Nametag</h1>
            <p className='text-xs md:text-sm font-semibold my-1 w-full md:w-[100%]'>Kami Menciptakan Produk Digital maupun layanan untuk Komunitas anda</p>
          </div>
        </div>
      </div>

      <div className='mt-20'>
        <h1 className='text-2xl md:text-3xl font-bold text-center text-black-500'>
          Mitra yang sudah bergabung
        </h1>
        <div className='flex flex-wrap justify-center space-x-4 mt-10'>
          <img className='w-[20%] md:w-[10%]' src={Bengkulu} alt="" />
          <img className='w-[20%] md:w-[10%]' src={DKI} alt="" />
          <img className='w-[20%] md:w-[10%]' src={Jambi} alt="" />
          <img className='w-[20%] md:w-[10%]' src={Riau} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Popular;
