import React from 'react'
import style from './Footer.module.css';
import facebookIcon from '../../assets/ff.png';
// import youtubeIcon from '../../assets/youtube_icon.png';
import twitterIcon from '../../assets/tw.png';
import instagramIcon from '../../assets/in.png';

export default function Footer() {
  return (
    <div className= {style.footer} >
      <div style={{maxWidth: "60%", margin: "0 auto"}}>
        <div className={style.icons}>
          {/* <img src={youtubeIcon} alt="" /> */}
          <img src={facebookIcon} alt="" />
          <img src={twitterIcon} alt="" />
          <img src={instagramIcon} alt="" />
        </div>
        <ul className={style.footer_links}>
          <li>Help Center</li>
          <li>Media Center</li>
          <li>Investors Relations</li>
          <li>Terms Of Use</li>
          <li>Privacy</li>
          <li>Legal Notices</li>
          <li>Corporate Information</li>
          <li>Contact Us</li>
        </ul>
        <div className={style.copy_right_text}>
          <i class="fa-regular fa-copyright"></i>
          <p>2025-2026 EgyZone</p>
        </div>
      </div>
    </div>
  )
}

