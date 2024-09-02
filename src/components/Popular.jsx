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

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-10'>
        {/* Left side */}
        <div className='col-span-1 h-full relative'>
          <img className='w-[15%] md:w-[25%] absolute left-6 sm:left-1 top-[120%] sm:top-[10%] transform -translate-y-1/2' src={Pinvert} alt="Pinvert" />
          <div className='bg-blue-100 rounded-2xl p-10 flex justify-center items-center h-[300px] md:h-[500px]'>
            <img className='w-[80%] md:w-[60%]' src={Website} alt="Website design" />
          </div>
          <h1 className='text-2xl md:text-3xl font-bold text-blue-500 w-full my-4'>
            Web Design
          </h1>
          <p className='text-sm md:text-base font-semibold w-full'>
            Anda dapat merequest ataupun membuat website sesuai dengan kebutuhan, kami akan membuatkan website sesuai dengan kebutuhan anda, atau akan kami rekomendasikan website yang sudah ada di platofrm kami ini
          </p>
        </div>

        {/* Right side */}
        <div className='col-span-1 flex flex-col space-y-4'>
          <div className='flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0'>
            <div className='flex flex-col w-full'>
              <div className='bg-blue-100 rounded-2xl p-2 flex justify-center items-center h-[150px] md:h-[200px]'>
                <img className='w-[40%] md:w-[65%]' src={Vest} alt="Vest" />
              </div>
              <div className='mt-2'>
                <h1 className='text-lg md:text-xl font-bold text-blue-500 w-full my-2'>Vest</h1>
                <p className='text-xs md:text-sm font-semibold my-1 w-full'>Kami Menciptakan Produk Digital maupun layanan untuk Komunitas anda</p>
              </div>
            </div>

            <div className='flex flex-col w-full'>
              <div className='bg-blue-100 rounded-2xl p-2 flex justify-center items-center h-[150px] md:h-[200px]'>
                <img className='w-[40%] md:w-[70%]' src={Report} alt="Report" />
              </div>
              <div className='mt-2'>
                <h1 className='text-lg md:text-xl font-bold text-blue-500 w-full my-2'>Aplikasi Pelaporan</h1>
                <p className='text-xs md:text-sm font-semibold my-1 w-full'>Kami Menciptakan Produk Digital maupun layanan untuk Komunitas anda</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col'>
            <div className='bg-blue-100 rounded-2xl p-5 flex justify-center items-center h-[150px] md:h-[200px]'>
              <img className='w-[40%] md:w-[42%]' src={Nametag} alt="Nametag" />
            </div>
            <h1 className='text-lg md:text-xl font-bold text-blue-500 w-full my-2'>Design Nametag</h1>
            <p className='text-xs md:text-sm font-semibold my-1 w-full'>Kami Menciptakan Produk Digital maupun layanan untuk Komunitas anda</p>
          </div>
        </div>
      </div>

      <div className='mt-20'>
        <h1 className='text-2xl md:text-3xl font-bold text-center text-black'>
          Mitra yang sudah bergabung
        </h1>
        <div className='flex flex-wrap justify-center space-x-4 mt-10'>
          <img className='w-[20%] md:w-[10%] mb-4' src={Bengkulu} alt="Bengkulu" />
          <img className='w-[20%] md:w-[10%] mb-4' src={DKI} alt="DKI" />
          <img className='w-[20%] md:w-[10%] mb-4' src={Jambi} alt="Jambi" />
          <img className='w-[20%] md:w-[10%] mb-4' src={Riau} alt="Riau" />
        </div>
      </div>
    </div>
  )
}

export default Popular;
