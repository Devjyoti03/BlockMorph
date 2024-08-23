import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules'; // Import Mousewheel module
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/mousewheel'; // Import Mousewheel styles

const teamMembers = [
  {
    name: 'Anindya Roy',
    image: '/metamask-logo.png',
    detail: 'Cybersecurity Expert',
  },
  {
    name: 'Debopriyo Roy',
    image: '/metamask-logo.png',
    detail: 'AI - ML Engineer',
  },
  {
    name: 'David Roy',
    image: '/metamask-logo.png',
    detail: 'UI/UX Frontend Designer',
  },
  {
    name: 'Sayan Genri',
    image: '/metamask-logo.png',
    detail: 'Web3 & Backend Engineer',
  },
  {
    name: 'David Brown',
    image: '/metamask-logo.png',
    detail: 'Full Stack Web3 Engineer',
  },
];

const AboutUs = () => {
  const customStyles = `
  .swiper-pagination-bullet {
    background-color: transparent; /* Make pagination bullets transparent */
    border: 1px solid #000; /* Optional: Add a border to bullets */
  }

  .swiper-pagination-bullet-active {
    background-color: transparent; /* Ensure active bullets are also transparent */
    border-color: #000; /* Optional: Change active bullet border color */
  }
  .swiper-wrapper {
    background-color: transparent !important; /* Make Swiper wrapper background transparent */
  }
`;
  return (
    <Box sx={{ width: '100%', padding: '20px 50px', paddingTop: '20px' }}>
      <style>{customStyles}</style>
      <Typography variant="h4" align="CENTER" gutterBottom className="text-gradient">
        Meet Our Team:
        {/* <img style={{ verticalAlign: 'middle', marginLeft: '14px' }} src="crv.svg" alt="bal" /> */}
      </Typography>
      <Typography variant="h2" align="center" gutterBottom className="text-gradient-1">
         THE GOODMAN CODE
      </Typography>
      <Swiper
        modules={[Navigation, Pagination, Mousewheel]} // Include Mousewheel module
        navigation
        pagination={{ clickable: true }}
        spaceBetween={20} // No space between slides
        slidesPerView={3} // Show 3 slides at a time
        centeredSlides={false} // Align slides to the left
        grabCursor={true} // Change cursor to grabbing hand
        mousewheel={true} // Enable mousewheel control
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }} // Responsive breakpoints for different screen sizes
      >
        {teamMembers.map((member, index) => (
          <SwiperSlide key={index}  className="gradient-bg-transactions">
            <Box
              sx={{
                paddingTop: '20px',
                paddingBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%',
                borderRadius: '30px' // Ensures the slide takes full width available
              }}
            >
              <Avatar
                src={member.image}
                alt={member.name}
                sx={{
                  width: 120,
                  height: 120,
                  marginBottom: 2,
                }}
              />
              <Typography variant="h5" className='text-gradient-1'>{member.name}</Typography>
              <Typography variant="body1" color="lightblue">
                {member.detail}
              </Typography>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default AboutUs;
