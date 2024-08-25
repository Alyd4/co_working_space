import React from 'react';
import fotbar from "../assets/foto_bersama.jpg"
import merry from "../assets/merry.jpg"
import pakdir from "../assets/pakdir.jpg"
import ainah from "../assets/AINAH.png"
import khalidah from "../assets/Alida.jpg"
import manda from "../assets/manda2.jpg"
import bella from "../assets/bella.jpg"

const teamMembers = [
  { name: 'Merry Indra Sari, AMD', title: 'Wakil Ketua Bidang Penguatan Sumber Daya', role: 'Supporter Platform Sembangin Metawork', img: merry },
  { name: 'Ahmad Syahroni, S.Pd', title: 'DED Kepulauan Riau', role: 'Founder Sembangin Metawork', img: pakdir },
];

const itSupportTeam = [
  { name: 'Khalidah', img: khalidah },
  { name: 'Amanda', img: manda },
  { name: 'Bella', img: bella },
  { name: 'Ainah', img: ainah },
];

export default function TentangKami() {
  return (
    <div className="bg-white ">
      <header className="relative">
        <img src={fotbar} alt="Header" className="w-full h-64 object-cover opacity-60" />
        <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-blue-600 font-bold">Tentang Kami</h1>
      </header>

      <section className="py-8 px-4">
        <div className="flex flex-col md:flex-row items-center justify-around mb-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center mb-8 md:mb-0">
              <img src={member.img} alt={member.name} className="w-40 h-40 object-cover rounded-full mx-auto mb-4" />
              <h2 className="text-xl font-semibold">{member.name}</h2>
              <p className="text-gray-600">{member.title}</p>
              <p className="text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
          <div className='mx-11'>
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Sejarah</h2>
          <p className="text-gray-700 mb-4">
            Awal mula terjadinya nama Sembangin, ketika komunitas masyarakat mengunjungi PKBI untuk mendapatkan informasi dan pendidikan, dan sebaliknya PKBI mengunjungi masyarakat ataupun komunitas untuk melayani.
            PKBI hadir tengah - tengah masyarakat KEPRI saling mengunjungi.
          </p>
          <p className='text-gray-700 mb-4'>
            Pada saat berinterkasi dengan masyarakat muncul kata dalam  bahasa melayu yaitu “sembang”, dalam bahasa Indonesia berarti mengunjungi.
            Kemudian, kata sembang ini ditarik menjadi tag line PKBI Daerah Kepulauan Riau.
          </p>
          <p className='text-gray-700 mb-4'>
            Setelah menjadi tag line, menjadikan agenda untuk remaja, tujuannya supaya remaja itu mempunyai aktivitas positif, munculah pendanaan untuk usaha kecil, dinamakan socio entrepreneur, usaha bersifat sosial, untuk mendorong remaja terlibat
            aktif dan berada di tengah - tengah komunitas, dengan mencari usaha menarik komunitas remaja yaitu boba, karena pada saat itu yang sedang trend adalah minuman boba, dan diberi nama Sembangin Boba. Dengan membangun usaha ataupun brand tersebut
            akan menjadi daya tarik untuk komunitas, bantuan support dana dari Merry selaku wakil ketua bidang penguatan sumber daya.
          </p>
          <p className='text-gray-700 mb-4'>
            Setelah menjadi tag line, menjadikan agenda untuk remaja, tujuannya supaya remaja itu mempunyai aktivitas positif, munculah pendanaan untuk usaha kecil, dinamakan socio entrepreneur, usaha bersifat sosial, untuk mendorong remaja terlibat
            aktif dan berada di tengah - tengah komunitas, dengan mencari usaha menarik komunitas remaja yaitu boba, karena pada saat itu yang sedang trend adalah minuman boba, dan diberi nama Sembangin Boba. Dengan membangun usaha ataupun brand tersebut
            akan menjadi daya tarik untuk komunitas, bantuan support dana dari Merry selaku wakil ketua bidang penguatan sumber daya.
          </p>
          <p className="text-gray-700 mb-4">
            Dengan menganut 2 Konteks <br />
            • Semb berarti nilai <br />
            • angin berarti kemampuan
          </p>
          <p className="text-gray-700">
            nilai sehat, mandiri, dan berencana ini tidak akan kuat jika tidak disertai dengan kemampuan bertanggung jawab dan untuk membangun inklusifitas ditengah masyarakat.
          </p>
          <p className='text-gray-700 mb-4'>
            Dan tersusunlah renstra daerah dengan manifestasi Semmbangin, Tersusun juga pengurus daerah, pengurus wakil ketua bidang penguatan sumber daya kembali mensuport sembangin untuk mendukung platform digital. Dengan harapan platform ini
            digunakan banyak orang, dibuatlah konsep beberapa platform digabung menjadi satu, kemudian dibuat infrastruktur, menjadi platform sembangin, di 2022. Tersusunlah platform jadilah platform sistem informasi.
          </p>
          <p className='text-gray-700 mb-4'>
            Ditarik menjadi brand “Sembangin Meta Work” karena yang menggunakan platform yang ada di PKBI Daerah Kepulauan Riau bukan hanya yang ada di Kepri, namun PKBI Daerah lain juga menggunakannya dan komunitas - komunitas dibawahnya.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-blue-600 mb-10">Team</h2>
          <h3 className='text-xl font-bold text-blue-600 text-center mb-5'>IT Support</h3>
          <div className="flex flex-wrap justify-center">
            {itSupportTeam.map((member, index) => (
              <div key={index} className="text-center m-4">
                <img src={member.img} alt={member.name} className="w-24 h-24 object-cover rounded-full mx-auto mb-2" />
                <p className="text-gray-700 font-semibold">{member.name}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
