"use client"

import React, { useState, useEffect, useRef } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

// We will populate this array with the 50 links you fetch!
const INSTAGRAM_POSTS = [
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DYj2lSlFNKZ/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/703222689_17902932210429474_714650713221854294_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&_nc_map=urlgen_bucketless&ig_cache_key=MzkwMTIwMTQ5NzA2MjU3MzMzMg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=57TTRPm8N3MQ7kNvwEQEfkL&_nc_oc=AdqJRVqvGg_PMXR-Kvkx1iFX7X6GvM73qFBR2WecZfzQAo1Wyda2xJPmb7f44zj6uMY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=Q7htm2D-8oCiyoZwnDP2aQ&_nc_ss=7a22e&oh=00_AQAd6ISrl0QE2Avzsd6jkmY2MObOnY95c-u1yH04YQOSHQ&oe=6A6EBE98"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DYj2bHzFA3S/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/702695651_17902931928429474_4577926676833332349_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&_nc_map=urlgen_bucketless&ig_cache_key=MzkwMTIwMDcwNjgyMjE4MjM3Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=TBVJTfriqWcQ7kNvwESBVJs&_nc_oc=AdqEe_YjaeGnvv7cJ9mT-Kpe8-I6ayEtl4GiJ4mRHgdkBpUMa0Csx9iJf3zceth1XNg&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=Q7htm2D-8oCiyoZwnDP2aQ&_nc_ss=7a22e&oh=00_AQCT6ly9O79nb_HIjHofbH8l4D2J7rPRhOxrwxhB_iZ0hQ&oe=6A6EB21C"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DYj2SKIlEh-/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/704726491_17902931685429474_1536888431285681534_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=104&_nc_map=urlgen_bucketless&ig_cache_key=MzkwMTIwMDEwMTg4NTk1NzE0Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=j5BjlzZZx-MQ7kNvwGnH1aQ&_nc_oc=AdrgtPWnHKkHqurGcivwm5K-p3QeEPfMs5P_JOxiLBQ_Xr5L7VWUnFy4uA9XA_Eh7GE&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=Q7htm2D-8oCiyoZwnDP2aQ&_nc_ss=7a22e&oh=00_AQD8SPgn8GtEA-Avdl4-tCfBVRQaexeP8z2llyCzvoXdpA&oe=6A6ECC1F"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DYjyrSElH5Q/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/703158318_17902928103429474_247273643217826793_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=108&_nc_map=urlgen_bucketless&ig_cache_key=MzkwMTE4NDIyMTgzMTUxMzg2Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMzAyNC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=YdHBU9HaSjgQ7kNvwEKI89z&_nc_oc=AdoycdHgxr20Wl7MEu3e214iro91H0km-N895MeCXDQBtNKKD56OgCvCZO3alc_kaFE&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=Q7htm2D-8oCiyoZwnDP2aQ&_nc_ss=7a22e&oh=00_AQDFholLguVmPR2wmUD7odxR4s48TfBVS2yCt4zrni-tYA&oe=6A6EA463"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DYjyaXMFLcW/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/704057072_17902927938429474_4660881847712395898_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&_nc_map=urlgen_bucketless&ig_cache_key=MzkwMTE4MzEwMjQ0NzQ4OTA0Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=bhBZi4oOdWMQ7kNvwE3tjhx&_nc_oc=AdpH6UhGCGyt0jzfORnpMzD4TlqfxP1P_oF4FO-PxOqiUoGnzrQCbWL61gwQlp5Q5RQ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=Q7htm2D-8oCiyoZwnDP2aQ&_nc_ss=7a22e&oh=00_AQBwk-CIsDC21ktQO7OFeHXSbDYXn3fT-UIBterzSSMANg&oe=6A6EC7FE"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DYjyQwsFA5o/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/704073011_17902927815429474_3437997947105282417_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&_nc_map=urlgen_bucketless&ig_cache_key=MzkwMTE4MjQ5NTM1NTQ0OTk1OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=C9uBRagfA58Q7kNvwH0dnFR&_nc_oc=Adrb5vnpSyX9bSPJPFdKSLToP0tiG4YOxT6v2FnertBHIwfrMBWvidK8P4SnBGOTBNM&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=Q7htm2D-8oCiyoZwnDP2aQ&_nc_ss=7a22e&oh=00_AQCe5csIZH6sn27ddJJ6uL1pMBkcV1bvPL0spyhy4MseyQ&oe=6A6EB31F"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DYjyHQ0lGV8/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/703297264_17902927719429474_2448854184254169076_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&_nc_map=urlgen_bucketless&ig_cache_key=MzkwMTE4MTc4ODY5MDgwNzQ0MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=bkZf121XwocQ7kNvwEXoqkU&_nc_oc=AdppidwHfbAfNOQlegcLbpbGu93vx6z9E-RFrEEAndtj47dlNDja-31xe7t28xcMMDU&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=S6ooSoRCRAOzmTzyfK6D_g&_nc_ss=7a22e&oh=00_AQAtliJtsb8m3h-CHOZaMScpRDPhznrczX2lXO9EkuZ21w&oe=6A6ECDDC"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DYjxwXDFAzy/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/702930450_17902927296429474_3785130902898843653_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&_nc_map=urlgen_bucketless&ig_cache_key=MzkwMTE4MDI1NjAxNjQwOTcyOA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=YEmUnYuCLlgQ7kNvwHAB90m&_nc_oc=Adpjk4dTFAHWvDM452buUagRupWpcN5gqDAbJ-tPHhOLqtVY5nCVkuon3IjuQu02KeY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=S6ooSoRCRAOzmTzyfK6D_g&_nc_ss=7a22e&oh=00_AQDlaONn3sBACivXZQbk_VqhtlXqJbhOKfBKfIRgUS7mZQ&oe=6A6EA789"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DYcQHKzFIxU/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/700679458_17902485138429474_6638242841414104789_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&_nc_map=urlgen_bucketless&ig_cache_key=Mzg5OTA2MTk4NDYxMzcxODc0Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=UVik_vdsdcYQ7kNvwGdzciP&_nc_oc=AdpYBuApzrlrMTR5B_rABPDBrkmIDql7b29grk1StVcYnrNqaoEX34Iw07MwS2QLR3E&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=S6ooSoRCRAOzmTzyfK6D_g&_nc_ss=7a22e&oh=00_AQAEh4iVrbDyfPHYZWOi6ZF4s-uy8N9Ar84rX6T7qzWMIQ&oe=6A6EA589"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DYcPqGZlK0t/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/700723484_17902484340429474_3217446498709687808_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=101&_nc_map=urlgen_bucketless&ig_cache_key=Mzg5OTA1OTkzMzQ2NDgxMzcwNg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMzAyNC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=CR054a2dlOsQ7kNvwFCYNy4&_nc_oc=Adr-smLrG5qjhHpiQ7S6yX-IriWp48_zlkerGANw82K4h16GPsxheHp5ebqjfNBf8Xs&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=S6ooSoRCRAOzmTzyfK6D_g&_nc_ss=7a22e&oh=00_AQB6p2MjDPSqaTTZD0L_QHEOrK5hUdjpVuLIE5F7j-YDCA&oe=6A6EA6BB"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DX9RPpOlHWS/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/688955347_17900729433429474_9173303417345541334_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=109&_nc_map=urlgen_bucketless&ig_cache_key=Mzg5MDM0MTE0MDE5ODY0NDY2Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=baF4fokWPAUQ7kNvwHCDPoB&_nc_oc=AdrsXPI4xOljR86eew0L1NCsoQiRnnOTOKZccvcXeoNgVr_b6l3kcgVcilXRYaSNKJc&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=S6ooSoRCRAOzmTzyfK6D_g&_nc_ss=7a22e&oh=00_AQBRYWizMJEcEOo7-geurv3bqRgLw4SKzO_eM3d_xEuQYw&oe=6A6EBF08"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DX9QoORFGlw/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/688782699_17900728473429474_5584800097052675823_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=104&_nc_map=urlgen_bucketless&ig_cache_key=Mzg5MDMzODI1MTg1ODM2NzUyNQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=5xnBIgA7XlUQ7kNvwH1wnQ6&_nc_oc=AdoO3X5Nbt3CeA9wzqUkTP8fOsBnr1OAsYfK28EENHgzmIOnHRB408v6t1v8OPpafZE&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=S6ooSoRCRAOzmTzyfK6D_g&_nc_ss=7a22e&oh=00_AQBVrQrpZGx6kTyIToROjCqPMINGfZ2z-V_sc_KtzD3a0g&oe=6A6ECBE2"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DX9Qb2olPSc/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/688348984_17900728386429474_7507461101009285662_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&_nc_map=urlgen_bucketless&ig_cache_key=Mzg5MDMzNzY2NDEwMjI5NDAzMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=tAOin2w9bTsQ7kNvwEZ5fkx&_nc_oc=AdpuI-BpGfLa1jIaRq7KpazNUwYKRzpPWEBt-EdDL6Zusbd6RSvT5myCRn0m8BwdA-0&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=S6ooSoRCRAOzmTzyfK6D_g&_nc_ss=7a22e&oh=00_AQDdls1wJ-7s3uLC1maYIQK7zCgkU-wiUygUTe_JqZqZzA&oe=6A6ED34B"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DX9QTfHFJx0/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/684813294_17900728290429474_7477862396994245707_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=102&_nc_map=urlgen_bucketless&ig_cache_key=Mzg5MDMzNjk2MTM1NDk1NTc2MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=xPPLHNJFB9gQ7kNvwG1zSUE&_nc_oc=AdpHCR3qwCxjK71mPwZNPkS9xbX8JwJIJshTYZFGxq0qEGvy1hR7ue-S_uNYsY9z9wg&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=S6ooSoRCRAOzmTzyfK6D_g&_nc_ss=7a22e&oh=00_AQD_CcdrCmXrAZ4z2WzIaZdPAcX7t69YJgNwbsY302Nizg&oe=6A6EAEAE"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DX9QJOWFJ_Q/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/688990825_17900728170429474_1343414706394860005_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=108&_nc_map=urlgen_bucketless&ig_cache_key=Mzg5MDMzNjM4MTkxMTkyOTkzNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=yNZFdFpnpaQQ7kNvwFU6Ra7&_nc_oc=AdqxgSNEFZMUvfAzSs8y4CXXfENrJzLYy0wDZaWwtrpLun5oMJp27orPfUqyj7pobSE&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=S6ooSoRCRAOzmTzyfK6D_g&_nc_ss=7a22e&oh=00_AQCRKmLCo6hER4ua4lA1QmZ8ifvijv88-o6QQo52_nFmRA&oe=6A6EBC43"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXtioIzFNBV/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/682084005_17899770489429474_3488116917199133443_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&_nc_map=urlgen_bucketless&ig_cache_key=Mzg4NTkxMzk0NDc0MTE3NDE2MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=XfDDuS2WCpIQ7kNvwFAcD1q&_nc_oc=Adrrq5SfGbcr2LN5s4jZnn0uj6ZoWvqahB6NxZIJnM8te1OKNV2_M4mC4HDCy79OIjM&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=S6ooSoRCRAOzmTzyfK6D_g&_nc_ss=7a22e&oh=00_AQADr4UpaX7PPvh__xtypsxSZq3zGc2GJDscvKIlEIMAtQ&oe=6A6ED60E"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXtighXlKJl/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/682315724_17899770378429474_4971712270296016879_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&_nc_map=urlgen_bucketless&ig_cache_key=Mzg4NTkxMzM2ODQyNzAyNTExNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=piTUazRn7zsQ7kNvwHIy1HR&_nc_oc=AdoU46fmct9z-LXB-tz2OZdkFclK78xNtIZvlTs49BWnmj--iNADi0tD1Q6p6X6AZiQ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=S6ooSoRCRAOzmTzyfK6D_g&_nc_ss=7a22e&oh=00_AQDA0Pos9KKTlT0i9k-vTWYG59TGLtnT-d9Dx6FL0gzeVQ&oe=6A6EB0AC"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXrxHo9FKyn/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/681945023_17899684791429474_4175213577527906385_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=100&_nc_map=urlgen_bucketless&ig_cache_key=Mzg4NTQxNDU4NTU3ODU1MzQ2MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=0vShZkVMcxAQ7kNvwFWXbis&_nc_oc=AdomLLtLeHAIM-BO2EYjXWp-OnINRKXLLTymioNeTp2E8rPTNKdKhuivIAVuqRjZbY4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=S6ooSoRCRAOzmTzyfK6D_g&_nc_ss=7a22e&oh=00_AQCTNKM5-JduAKN9U35TaSnQi7IZoNUpjE7E5UBtuVnnHA&oe=6A6EB260"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXrw7zXFACK/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/683750511_17899684383429474_1395340422460976478_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&_nc_map=urlgen_bucketless&ig_cache_key=Mzg4NTQxMzg0NzczMzQyNjc0OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTE3MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=e4BO6Wd7yaIQ7kNvwEl5uKg&_nc_oc=Adpmr1onTj7p5yAKl3EUJ_U_KhSHW4NGis79m4UCC_urmRoBr2cDZUulhbCh-IkrbUY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=3HNcabFqPeawcXVb2LsR6w&_nc_ss=7a22e&oh=00_AQDJ6E73BZuvx-rn4T2rTwFcprO9izBFwOQFm1FsEdXTWg&oe=6A6EB87C"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXpN2DoCT_z/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/682922157_17899534737429474_5084061726924212627_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=108&_nc_map=urlgen_bucketless&ig_cache_key=Mzg4NDY5NjYyMDQ5MTE4MDU5Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=gy0bvLc3i4oQ7kNvwEPfYVx&_nc_oc=Adr3cwhEin3gka5nyY9SiabSjTVoBvSgsgALB-rgaHwg5cgbvc2JRA7aGgfZh8hyfuY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=3HNcabFqPeawcXVb2LsR6w&_nc_ss=7a22e&oh=00_AQBXtS55AFdgCnjmYm8GQIuXAQOGuCZpxK5QmhReTiaEhQ&oe=6A6EC7A8"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXoCgrsFPGK/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/684050328_17899464726429474_2677194601996146808_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=102&_nc_map=urlgen_bucketless&ig_cache_key=Mzg4NDM2NTM2MDI0OTk4OTY2Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=vYIK8NZbvbQQ7kNvwHJ8nSk&_nc_oc=AdociNQS0nEvxc7UqnLnJdV_-U0-0GR0TnD8N9V5u2WYzxmbWXxPfCIhTWRn8XyHYNk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=3HNcabFqPeawcXVb2LsR6w&_nc_ss=7a22e&oh=00_AQDs8eaHIdEaTzi07hzQ3m_PTN1sPUEZ44E5nj00lqPdQw&oe=6A6EAB89"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXmQI_slEdi/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/681461819_17899348731429474_6808818717700049955_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&_nc_map=urlgen_bucketless&ig_cache_key=Mzg4Mzg2MjM4ODIwNjIyMDQwMA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=HKm3rbmyq1UQ7kNvwGFDdp5&_nc_oc=AdoriIt3anPkofXWr7HO8tkJZEgKll49Bw5oJ3LavgJ1l3MriQQ5i4zA62dbKsyJXW8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=3HNcabFqPeawcXVb2LsR6w&_nc_ss=7a22e&oh=00_AQBWyqwX7JhG1JJikjZexBRCnK5x5d4aplJvc5kQjgMTNA&oe=6A6EC7AF"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXZM-iulCqU/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/671197011_17898586863429474_7742577940166670276_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=101&_nc_map=urlgen_bucketless&ig_cache_key=Mzg4MDE4OTQ5MDAwNjM5MjY2OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=mMQZFdcCS-UQ7kNvwHkXlSO&_nc_oc=AdrZ1EiEYJKOK-vZa1Bf-nzQSWgKX6PEeFdqSO1XtTQCjSiwAm11EGMIJqtaHyUPpV4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=3HNcabFqPeawcXVb2LsR6w&_nc_ss=7a22e&oh=00_AQD3QSQFoHU0OGjkBFPHLRPYXFAIjFYsa9xtkpdGqXLYEg&oe=6A6EC552"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXZM5u9FAbZ/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/671215385_17898586635429474_3227919979416935614_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=109&_nc_map=urlgen_bucketless&ig_cache_key=Mzg4MDE4ODg4NzM4NTU1MjczOQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=_tpsBzDrysQQ7kNvwHafFSg&_nc_oc=AdqLnB8K-D_DcrpZvwie5LtnjZiMjrCKzWLEI7u9DqI7l2FXXZBKCMDoj3B1WWZ-bYs&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=3HNcabFqPeawcXVb2LsR6w&_nc_ss=7a22e&oh=00_AQBX92dL8y-rzwGY66JofR-whKvynK4UW2gfRRzPCgAwPQ&oe=6A6EC632"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXMhSPXFLrF/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/671748992_17897845572429474_1597612682774203736_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&_nc_map=urlgen_bucketless&ig_cache_key=Mzg3NjYxOTI4MTc5ODU4MDg0MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTE3MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=muOLJ-e3njYQ7kNvwEREkpx&_nc_oc=Adpvne0SSt68guYN_zBdwdxBdRyUaH4vYY4AA_aF27IgJScQTOVoMjpd346fuCXeJfk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=3HNcabFqPeawcXVb2LsR6w&_nc_ss=7a22e&oh=00_AQDqYcQX4Yc-uRMSygz88mpZEqQnBsJVEBzi2KlhyP5p-w&oe=6A6EB7A7"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXMg2iAlDhK/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/671215383_17897845044429474_3744702566274228255_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=102&_nc_map=urlgen_bucketless&ig_cache_key=Mzg3NjYxNzM4MjA3MjQ0MzQ5MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=br7fZUMfZvMQ7kNvwH_-KgJ&_nc_oc=Adpuas9bDKUeW9eCk6rGijvOg9FkO21bLA28ldLLiQF6mOv_tt-ujBXl66MfMRPmfeY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=3HNcabFqPeawcXVb2LsR6w&_nc_ss=7a22e&oh=00_AQA1EfkCBjnAZ-mfwz7iPcwp3vUzqk6AonLtuGXrqrJ-qQ&oe=6A6EA055"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXMgl_pFPkG/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/670962204_17897844711429474_1018230457939229846_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&_nc_map=urlgen_bucketless&ig_cache_key=Mzg3NjYxNjMwMjY2ODI4NjEwMg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTE3MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=pizobEWBKqMQ7kNvwGM-weE&_nc_oc=AdrFqWIcGe5chYKopNM420MYutCRpUNmbzykd-gMgtva-J19hPMUaabLw4p9bR2fTUU&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=3HNcabFqPeawcXVb2LsR6w&_nc_ss=7a22e&oh=00_AQCAl6amLvFcJvpG9BdirSh0GtWfQ1Hddvyz4pE_XgTkXw&oe=6A6EC6EE"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXMgHehlInv/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/670162329_17897843841429474_647209731442963022_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&_nc_map=urlgen_bucketless&ig_cache_key=Mzg3NjYxNDExNDQ2NjM3ODY0NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=3ojMktf5PJEQ7kNvwGLtKAR&_nc_oc=Adoa2LaZOPSZbumBkjDeAHDmp7BHbilKiIOjVebIDHJQ0CWbeYg9Stu4sbhs7dDxQzE&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=3HNcabFqPeawcXVb2LsR6w&_nc_ss=7a22e&oh=00_AQBnArqjBbMe2Wj48dRuMky476FTSk6ng5YTC4ICrqEesA&oe=6A6ED367"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXMfu0BFNC5/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/671227664_17897843271429474_5750061095869176625_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&_nc_map=urlgen_bucketless&ig_cache_key=Mzg3NjYxMjYxMTExODc0NjY0NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=_6qTw5jO7-kQ7kNvwF6UTIs&_nc_oc=Adp3V1GyHDfqpBXCp9AlfEH-iVMTm43ddAHTE10E5UkoYh2FaZ8ERUo5iWyllNS3A80&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=3HNcabFqPeawcXVb2LsR6w&_nc_ss=7a22e&oh=00_AQCOCpuK0vqdUWG5MwETiGqq5ZVG6uiouCj3VZlRvaVsdw&oe=6A6EA5EC"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DXMfkVnFAH4/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/670903001_17897843082429474_2744987792364742527_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&_nc_map=urlgen_bucketless&ig_cache_key=Mzg3NjYxMTg2NDc5MjY2Mjg2MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=4poaBOJROfoQ7kNvwGo0X3P&_nc_oc=Adrgf-ygOR5BvJi8m66gfmyQHnLZM2sYLkEdO_r4o_JTglsTU2Pff-g33uK57vLPUJM&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=3HNcabFqPeawcXVb2LsR6w&_nc_ss=7a22e&oh=00_AQAgyrJQ-OYnE0BPkK4bXHTkIEJE1sk4SbM7ukAel3V_yA&oe=6A6EADCA"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DW8vAn3lBwz/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/662528440_17896985697429474_2591817875033316002_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&_nc_map=urlgen_bucketless&ig_cache_key=Mzg3MjE3NjAxODQ4NDEzMjgyMg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTE3MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=i8w_GIzUM0QQ7kNvwECdfS1&_nc_oc=AdrIWbZM_BP2vj9JzpmJuSmb9Wv7_A0Ni9bnXlAgymKNphpucV9NE0Wk-5uuZZ4REVY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=zqbvbHQWrjuGMUmUTOsEug&_nc_ss=7a22e&oh=00_AQCYT0ad6_x0G_8Sa1WzZtfzizSlHUwfHgVriHiIHE6LaQ&oe=6A6EAFC2"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DWROKzZlCYc/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/658309682_17894341569429474_210489067254571630_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=110&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1OTkyODA0MDA0NjM1NDk2Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=ziqEH8I5_BsQ7kNvwGthFw2&_nc_oc=Adplji70ldZmKDWSQZz36ZlW3YxPSpTzwxF3_VG1Fm5W0N117WvcEP8pVKLCv1ERs34&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=zqbvbHQWrjuGMUmUTOsEug&_nc_ss=7a22e&oh=00_AQBurm6IRVqFHiHpPb0IRUL1n9PfvaDfJC4XvZcuWEj20Q&oe=6A6ED510"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DWPFOOBCc6L/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/656365874_17894215389429474_7163564979224101422_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=103&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1OTMyNTk1MDIxNTQ0NTY3Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=75LNXp7Q9J0Q7kNvwG4iUlS&_nc_oc=AdpRVV0lpTLtwndTZbQDU1SGe1IBviGGr9ZtM5QUv5UKTJIv3G5YLosDt6K213Tbf-Y&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=zqbvbHQWrjuGMUmUTOsEug&_nc_ss=7a22e&oh=00_AQBvxNC5iu8nJNOAl6QUmisYFJiDLaGKOjFtYCRLo4h3Kg&oe=6A6EA2E1"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DWOs97cFLPx/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/656081891_17894181129429474_7020034582702169298_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=109&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1OTIxOTMyODQ2NTkxMjQxMA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=R9JOMt4ZGigQ7kNvwHLjjCu&_nc_oc=Adoyigelog7Oq09ROYPSI2ANPzog8vLVne2QBw8qLmbovctzMNXpx3Ql5OK03WCoAZg&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=zqbvbHQWrjuGMUmUTOsEug&_nc_ss=7a22e&oh=00_AQBvXk_mqASbLPZ5jC5GzOTyFdVhGFdDlkFcRQ7NiX6KnQ&oe=6A6EB296"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/reel/DWOsgx8CKis/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.71878-15/655726055_1978827066404066_7666802417901855400_n.jpg?stp=dst-jpegr_e15_tt6&_nc_cat=105&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1OTIxNzY5NzM5MzM4NzY5Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjY0MC5oZHIudmlkZW9fbmZyYW1lX2NvdmVyX2ZyYW1lLkMzIn0%3D&_nc_ohc=GFO_ucdT4YAQ7kNvwFc2XWn&_nc_oc=AdqDnmmGTewoeNodzufvxIdVOM0v5IBpCkUzYCgaep5pjsjXkjLsx053Ybc_kEWUtho&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=instagram.fccj3-1.fna&_nc_gid=zqbvbHQWrjuGMUmUTOsEug&_nc_ss=7a22e&oh=00_AQAZAWwr66OdR8N1x23x3QbPr4aiZlngo-yhLDlnFPrnzw&oe=6A6ED399"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DWOr62ulJ8v/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/655064746_17894179311429474_5774994115772301425_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1OTIxMzgyMjM2ODE3ODI5Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=U_87LNEHRfwQ7kNvwGrdxnF&_nc_oc=Adq2x0S2bnW8Xj0UCzbFb4Xo_U5fiYISIUbuFP90nNd3a4iufK4Bl-mg9TS5D18QjkE&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=zqbvbHQWrjuGMUmUTOsEug&_nc_ss=7a22e&oh=00_AQAPglUve8dzDalyZ_JzKkYrU7Nu7mHV2V6tyx4ADqtA9A&oe=6A6EBDB6"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DWOdjjcFA2G/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/656000728_17894162331429474_6930281270320977257_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=110&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1OTE1MTU4MDM4MTYyODUwMA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=TW3WHEN9B1gQ7kNvwGnC9NI&_nc_oc=AdphYR9BYJCHxV0YrV2eKiSK79x2gQ-nOxvREzwiC0FL9-HODRinu2qckv6wWLLVL5U&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=zqbvbHQWrjuGMUmUTOsEug&_nc_ss=7a22e&oh=00_AQDlSeXJ3NuAvs6hBHleVE0vbNO4CZwIqvG55aWkvcYvnQ&oe=6A6EABBE"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DWOdM4flOCC/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/657863704_17894161866429474_6491393806997385992_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=106&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1OTE0OTk5OTk2Nzg3MjA5NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=ywWJXSLluKsQ7kNvwEy8HI9&_nc_oc=AdoPVAbc1v8D9P8wEC3ecp3bfCRICZcDMxESca_Il3FdSufABu1v-xLiW9EHQ3lU2XY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=zqbvbHQWrjuGMUmUTOsEug&_nc_ss=7a22e&oh=00_AQCp2IpSpXSlrevplu-htGnHApDzhVT5zM6wO99f7r0cdw&oe=6A6EB888"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DWOc8hmlNkO/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/656891357_17894161455429474_7445866523507854134_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1OTE0ODg3NDYxOTMzNjQ1OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=tUiVVmlYh3QQ7kNvwE1m5iu&_nc_oc=AdoF-MD9DBbYKHOgDeCXP5A-9kW-XokgO112kaxm4H7NlNFzzRosSzexFp7inyQdenA&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=zqbvbHQWrjuGMUmUTOsEug&_nc_ss=7a22e&oh=00_AQCSGbk23WN0j2VMTqMhcIEwpCK1OBboiSrHSajAw-aVGw&oe=6A6EBF9E"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DWOckNQlKR3/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/655225333_17894160852429474_3930589612693436577_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1OTE0NzI3Mjg1NjU5ODc5MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=s8AM03xKl50Q7kNvwG1GtZY&_nc_oc=Adp-EfPqgjkhYYKF8PkbJta6RA04NPNyO2ejQNZyBcRagfvimmWmfyAqPPVc0dFqsfk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=zqbvbHQWrjuGMUmUTOsEug&_nc_ss=7a22e&oh=00_AQAsjG2Ay3WK4Uq4q8UD_GaNNmbSwSfaz1J80P5eFirp-Q&oe=6A6EBB89"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DWOcQ-bFGYV/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/656267201_17894160396429474_5174864920029707240_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=100&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1OTE0NTc2Njk0MjAzMTkwOA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=CKOGwnRsc58Q7kNvwHW-XCS&_nc_oc=AdrYQAATi0v9I8uIKBvCuarguT4x_NIj6DhUSDWnVa3o5FiAltidRBKzHynSACQ2D-Y&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=zqbvbHQWrjuGMUmUTOsEug&_nc_ss=7a22e&oh=00_AQAL5gdwFitfQq62s2pS79KWjFr1vnO54ajxXc4A6bV5SQ&oe=6A6EC667"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DWOcC97lJ8U/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/655599464_17894160201429474_4498643466527998648_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1OTE0NTA1NTAyNjA0MjE4OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=j5H3_EYjQXkQ7kNvwFMUdzS&_nc_oc=AdqDlNddK56Dmvg1nEbxblstR1J6DibBBvKv4U2Mx5Ugxd74dVu4BMHHQQX4CcQSiZo&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=zqbvbHQWrjuGMUmUTOsEug&_nc_ss=7a22e&oh=00_AQA52fyU3DfS9MJfF0TEhzwpYHPXDPgK-0T-J4lfHJcKzA&oe=6A6EC4CE"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DWObXoelMSR/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/655074682_17894159436429474_4476224750277719487_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1OTE0MTU2NTUyNDUyNDYxNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=Seau807LWckQ7kNvwFU5nb7&_nc_oc=AdrNrGiii-b7sNxGcTvnSK61bZyHHjzuHnYY8IJcHx_lxAY6slPeimEo7eaxg_Dg1ec&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=BsK5absvXT-66Cr2MaLxqg&_nc_ss=7a22e&oh=00_AQBKqgD48XxPl34Cl87fgYslGCQ9VTiveLhpbprx6LVXqg&oe=6A6EBDF4"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DWObFFilAzT/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/656241494_17894159160429474_4783040176553941843_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1OTE0MDQ5NjY4MTYzMTU2Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=XODC6OpWG3oQ7kNvwFZuHZQ&_nc_oc=Ado-k82zeciFskrwIpts7XU9xQfzZgS5coRgX0F8zBGpu9WOkESJNyOa5_iQWBEiMK0&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=BsK5absvXT-66Cr2MaLxqg&_nc_ss=7a22e&oh=00_AQBsZ9xlLKm7GdCSsGFyykgruF6Yb_yGZ1TN4PTnRShx9g&oe=6A6EB8ED"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DWI8t_glCqF/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/654569752_17893781937429474_8482736876769454744_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=103&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1NzU5OTQzMjk0NjY3NTUzNg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=akkbkfORE-AQ7kNvwHOoYBz&_nc_oc=AdqokQiOuT4r-U_RUrRyLG2-Bvz89dt7cdJmFtfvFxNWd_Amkqf5LR3SnggM1zpFfvw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=BsK5absvXT-66Cr2MaLxqg&_nc_ss=7a22e&oh=00_AQDPT4KKdTbrqM7Ms57o6enq76LzO9_1OydTQYLsAHVMJg&oe=6A6ECCD1"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DWGOdjtlPAg/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/654288096_17893591197429474_7252831649479356853_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1NjgzMzM1NDQ5NDY1NjEwMg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=CO3fUL5icNQQ7kNvwHLRE3V&_nc_oc=Adpvpbgr7KrWovnhk_IiPiPSEZxWcfuuZ_Wc2EqbhpCNw0vl9fXfeVhj2GZHQ7JTwS8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=BsK5absvXT-66Cr2MaLxqg&_nc_ss=7a22e&oh=00_AQA8F1vs9-RvKqox5L0d9ppTNQTbdD9lYdWLUJj6KCpL3Q&oe=6A6EC6F4"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DV_LGBWFDg7/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/654443624_17893129623429474_80776490245761973_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1NDg0ODAzNDQxNjkxNjEyNg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=BEQ9nSeSylsQ7kNvwGDE0Fa&_nc_oc=AdpCAd2QZ1Ssi5vVNiDTBOZ-3NmjAkmSFfvwbVcchH_lfXn6BV-yu3rhdNnyd0QuWD4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=BsK5absvXT-66Cr2MaLxqg&_nc_ss=7a22e&oh=00_AQD3ERpZMWXPytZYAM1-G4EuCU4Faa7WuKx40s2RyxbQvg&oe=6A6ED058"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DV5TWRUFLQB/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/650378228_17892786168429474_1772937906971327903_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1MzE5NTQwNDI2NzUyNjI4Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=6fBQhgRNNEEQ7kNvwFzC6XG&_nc_oc=AdqjcMT3n7wWgLGzwWhCZPRANf_3ddKl_57qyAuN15KeJ3IcnaoNE-39T_lO_vUXIOI&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=BsK5absvXT-66Cr2MaLxqg&_nc_ss=7a22e&oh=00_AQAzX3K-XoReQqwp0vVt9XIgOVG_ELUioIXCQ4X-_iIdig&oe=6A6EB5B5"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DV0bxkzFILT/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/651017199_17892513453429474_919033590715938064_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1MTgyNTAwNTMyNzgzODg5Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTE3MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=LBn6NEEo838Q7kNvwEpCpbI&_nc_oc=AdpREWjHInlMMxiNyh-GTKmLtx0LG6B70RLAiK8KbaL3h63GEWsXTjkr-xaqoHiJqWk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=BsK5absvXT-66Cr2MaLxqg&_nc_ss=7a22e&oh=00_AQB9aHtktNGaH3tpvr06FiTG4vUH6HWfdBl3IfjGdFtO2g&oe=6A6ED257"
  },
  {
    "link": "https://www.instagram.com/retrotimeco.in/p/DVx1r-LlOqI/?hl=en",
    "image": "https://instagram.fccj3-1.fna.fbcdn.net/v/t51.82787-15/649604629_17892369468429474_5729580650636766424_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&_nc_map=urlgen_bucketless&ig_cache_key=Mzg1MTA5NTEwNzU3MTM0MjQ5Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuOTYwLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=tEmL4q8IFU8Q7kNvwGSN887&_nc_oc=AdrsGftlpINzrVAFENfRMa4fIxxChQj2LzNWKiVFFFraEXPl3WV_QNQ8EgwlAmGoyk0&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fccj3-1.fna&_nc_gid=BsK5absvXT-66Cr2MaLxqg&_nc_ss=7a22e&oh=00_AQC1LDWk9Ob2sqCFiQtV7aAPGOGOHBy6TgyDXbd-82TjQA&oe=6A6EA112"
  }
]

export function InstagramFeed() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-24 bg-white border-t border-[var(--color-border)] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-[var(--color-text-primary)] tracking-tight">
              Join the Club
            </h2>
            <p className="mt-4 text-[var(--color-text-secondary)] text-lg">
              Follow our daily horological discoveries and behind-the-scenes restoration work on Instagram.
            </p>
          </div>
          <Link
            href="https://www.instagram.com/retrotimeco.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full font-bold text-sm tracking-wider uppercase shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all w-fit"
          >
            <InstagramIcon className="w-5 h-5" />
            <span>@retrotimeco.in</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative group">
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-[#202223] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 pt-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {INSTAGRAM_POSTS.map((post, idx) => (
              <Link 
                key={idx}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="snap-start shrink-0 relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-3xl overflow-hidden shadow-md border border-[var(--color-border)] group/item"
              >
                <img
                  src={post.image}
                  alt={`Instagram post ${idx + 1}`}
                  className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <InstagramIcon className="text-white w-10 h-10 opacity-0 group-hover/item:opacity-100 transform scale-50 group-hover/item:scale-100 transition-all duration-300 drop-shadow-lg" />
                </div>
              </Link>
            ))}
          </div>

          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-[#202223] opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
