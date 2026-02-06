import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  HardDrive, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  RotateCcw,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Zap,
  Power,
  Palette,
  Settings,
  FileCode,
  ExternalLink,
  Laptop,
  Languages,
  Sparkles,
  Loader2,
  Layout,
  Info,
  Fingerprint,
  RefreshCw,
  FileWarning
} from 'lucide-react';

const App = () => {
  const [step, setStep] = useState('start');
  const [history, setHistory] = useState([]);
  const [lang, setLang] = useState('en'); // 'en' or 'ms'
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const apiKey = ""; // Environment provides key at runtime

  // --- Translations & Comprehensive Logic Flow ---
  const content = {
    en: {
      header: "Pi Helper",
      subHeader: "Troubleshooting Guide",
      startOver: "Reset",
      mission: "Instruction:",
      recommendation: "Diagnosis & Next Steps:",
      footer: "Built for MakerLab in Schools by Penang Science Cluster • Inspiring Innovation",
      aiLabel: "Optional: Tell us what's happening",
      aiPlaceholder: "e.g., 'The light is red' or 'The screen is stuck'...",
      aiButton: "Analyze Issue",
      aiError: "System couldn't identify the step. Please use the manual guide below.",
      steps: {
        start: {
          title: "Is your Raspberry Pi switching on?",
          description: "Let's check if the hardware is getting any power at all.",
          icon: <Power className="w-12 h-12 text-[#206a5d]" />,
          options: [
            { label: "Yes, it's on!", next: 'led_check', color: 'bg-[#206a5d]' },
            { label: "No, it's silent.", next: 'plug_in', color: 'bg-slate-700' }
          ]
        },
        plug_in: {
          title: "Checking the Power Outlet",
          description: "Simple things first! Let's make sure the power is connected.",
          icon: <Zap className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Ensure the power cable is firmly plugged into both the Raspberry Pi hardware and the power extension/wall outlet.",
          image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1000", 
          options: [
            { label: "Okay, it's plugged in!", next: 'led_check', color: 'bg-[#206a5d]' }
          ]
        },
        led_check: {
          title: "The Power Light Test",
          description: "Look at the Raspberry Pi hardware. There is a light on the power button itself.",
          icon: <Palette className="w-12 h-12 text-[#206a5d]" />,
          instruction: "What color is the light on the Raspberry Pi power button?",
          image: "https://www.raspberrypi.com/documentation/computers/images/Pi5-annotated-top.png",
          options: [
            { label: "Yellow (Blinking/Steady)", next: 'use_check', color: 'bg-yellow-600' },
            { label: "Red (Solid)", next: 'press_button', color: 'bg-red-600' },
            { label: "No light at all", next: 'swap_psu', color: 'bg-slate-600' }
          ]
        },
        press_button: {
          title: "Press the Power Button",
          description: "A red light means the Pi is in 'standby' mode and hasn't been turned on yet.",
          icon: <Fingerprint className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Firmly press the power button on the side of the Raspberry Pi hardware once.",
          image: "https://www.raspberrypi.com/documentation/computers/images/Pi5-annotated-side.png",
          options: [
            { label: "It turned Yellow!", next: 'use_check', color: 'bg-[#206a5d]' },
            { label: "Still Red / No change", next: 'swap_psu', color: 'bg-slate-700' }
          ]
        },
        swap_psu: {
          title: "Power Supply Swap",
          description: "The current power supply or cable might be faulty.",
          icon: <RefreshCw className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Try swapping the Raspberry Pi power supply/cable with another one that you know works.",
          options: [
            { label: "I see a light now!", next: 'led_check', color: 'bg-[#206a5d]' },
            { label: "Still no light at all", next: 'pi_faulty_result', color: 'bg-red-600' }
          ]
        },
        pi_faulty_result: {
          type: 'result',
          status: 'error',
          title: "Diagnosis: Hardware Failure",
          description: "Since the Pi shows no light even after changing the power cable, the board itself is likely faulty.",
          recommendation: "The Raspberry Pi hardware needs to be replaced. Please label this unit as 'Faulty' and contact your PSC program lead.",
          icon: <AlertCircle className="w-16 h-16 text-red-600" />
        },
        use_check: {
          title: "Usability Check",
          description: "The light is yellow, which is a great sign for the hardware!",
          icon: <Cpu className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Are you able to use the computer (see the desktop, move the mouse)?",
          options: [
            { label: "Yes, I can use it!", next: 'os_confirmation', color: 'bg-[#206a5d]' },
            { label: "No, I still can't use it.", next: 'monitor_check', color: 'bg-slate-700' }
          ]
        },
        os_confirmation: {
          title: "System Verification",
          description: "You've confirmed the hardware and input are responding.",
          icon: <Layout className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Can you see the full Raspberry Pi OS desktop (the menu, wallpaper, and icons)?",
          options: [
            { label: "Yes, everything is working!", next: 'it_works', color: 'bg-[#206a5d]' },
            { label: "No, I'm not seeing the desktop", next: 'sd_reformat', color: 'bg-orange-600' }
          ]
        },
        monitor_check: {
          title: "Is the Screen Showing Anything?",
          description: "The hardware is on, but we need to check if the image is reaching the screen.",
          icon: <Monitor className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Look at your monitor screen. Do you see any text, colors, or the desktop?",
          options: [
            { label: "Yes, I see something (but it's not working right)", next: 'sd_reformat', color: 'bg-orange-500' },
            { label: "No, it's completely black.", next: 'monitor_hdmi_check', color: 'bg-slate-700' }
          ]
        },
        monitor_hdmi_check: {
          title: "Monitor Rescue: HDMI Check",
          description: "Let's check the connection between the Pi and the screen.",
          icon: <Settings className="w-12 h-12 text-slate-500" />,
          instruction: "1. Make sure the monitor is switched on. 2. Unplug and replug the HDMI cable firmly. 3. Try a different HDMI cable.",
          image: "https://images.unsplash.com/photo-1629739682536-3990664972f7?auto=format&fit=crop&q=80&w=1000",
          options: [
            { label: "It works now!", next: 'os_confirmation', color: 'bg-[#206a5d]' },
            { label: "Still a black screen", next: 'monitor_swap_check', color: 'bg-slate-700' }
          ]
        },
        monitor_swap_check: {
          title: "Monitor Rescue: Screen Swap",
          description: "The cables are fine, but the monitor itself might be the issue.",
          icon: <Monitor className="w-12 h-12 text-slate-500" />,
          instruction: "Connect the Raspberry Pi hardware to a completely different monitor that you know is working.",
          options: [
            { label: "It works on the new screen!", next: 'os_confirmation', color: 'bg-[#206a5d]' },
            { label: "Still nothing on any screen", next: 'monitor_fail_result', color: 'bg-orange-600' },
            { label: "Screen is on, but Pi won't boot", next: 'sd_reformat', color: 'bg-blue-700' }
          ]
        },
        monitor_fail_result: {
          type: 'result',
          status: 'warning',
          title: "Diagnosis: Faulty Monitor or Cable",
          description: "The original HDMI cable or the monitor itself appears to be broken.",
          recommendation: "Replace the HDMI cable first. If the problem persists, the monitor needs to be replaced. Contact the PSC program lead to arrange a replacement.",
          icon: <Monitor className="w-16 h-16 text-orange-500" />
        },
        sd_reformat: {
          title: "The Brain Check: Phase 1 (Software)",
          description: "The hardware is on, but the software on the card might be corrupted.",
          icon: <Laptop className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Follow these steps exactly on a separate computer:",
          detailedSteps: [
            { text: "Open 'Raspberry Pi Imager'. If you don't have it, install it from:", link: "https://www.raspberrypi.com/software/" },
            { text: "Select Device: Raspberry Pi 5", bold: true },
            { text: "Select OS: Raspberry Pi OS (64-bit)", bold: true },
            { text: "Customization such as hostname, localization, and user account registration are optional." }
          ],
          image: "https://www.raspberrypi.com/documentation/computers/images/imager-v1.8.png",
          options: [
            { label: "Reformat complete! Desktop is visible.", next: 'sd_corrupted_result', color: 'bg-[#206a5d]' },
            { label: "I reformatted, but it still won't boot", next: 'sd_swap', color: 'bg-slate-700' }
          ]
        },
        sd_corrupted_result: {
          type: 'result',
          status: 'success',
          title: "Diagnosis: microSD Card Corrupted",
          description: "Your Raspberry Pi hardware is fine, but the data on the microSD card was corrupted.",
          recommendation: "Reformatting fixed the software issue. To prevent this, always 'Shut Down' from the Pi menu before unplugging the power.",
          icon: <FileWarning className="w-16 h-16 text-[#206a5d]" />
        },
        sd_swap: {
          title: "The Brain Check: Phase 2 (Hardware)",
          description: "If reformatting didn't help, the physical card might be corrupted or faulty.",
          icon: <HardDrive className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Swap to a different microSD card that you know is working (borrow one from a successful setup).",
          options: [
            { label: "That fixed it! Desktop is visible.", next: 'sd_faulty_result', color: 'bg-[#206a5d]' },
            { label: "Even a new card fails", next: 'sd_pi_fail_result', color: 'bg-red-600' }
          ]
        },
        sd_faulty_result: {
          type: 'result',
          status: 'success',
          title: "Diagnosis: microSD Card Hardware Failure",
          description: "Your previous microSD card is likely physically faulty or permanently corrupted.",
          recommendation: "Since a different card worked, your old card needs to be replaced. Please label the old card as 'Faulty' and dispose of it properly.",
          icon: <HardDrive className="w-16 h-16 text-[#206a5d]" />
        },
        sd_pi_fail_result: {
          type: 'result',
          status: 'error',
          title: "Diagnosis: Hardware or Slot Failure",
          description: "We've checked the monitor, the cables, and multiple microSD cards.",
          recommendation: "Since even a good microSD card failed, the Raspberry Pi hardware itself likely has a fault and needs to be replaced.",
          icon: <AlertCircle className="w-16 h-16 text-red-600" />
        },
        it_works: {
          type: 'result',
          status: 'success',
          title: "System Fully Operational",
          description: "Your Raspberry Pi hardware is up and running. Happy computing!",
          recommendation: "Remember to always shut down properly from the menu before unplugging or switching off the plug.",
          icon: <CheckCircle2 className="w-16 h-16 text-[#206a5d]" />
        }
      }
    },
    ms: {
      header: "Pi Helper",
      subHeader: "Panduan Penyelesaian Masalah",
      startOver: "Set Semula",
      mission: "Arahan:",
      recommendation: "Diagnosis & Langkah Seterusnya:",
      footer: "Dibina untuk program MakerLab di Sekolah oleh Penang Science Cluster",
      aiLabel: "Pilihan: Ceritakan apa yang berlaku",
      aiPlaceholder: "contoh: 'Lampu merah menyala' atau 'Skrin hitam'...",
      aiButton: "Analisis Masalah",
      aiError: "Maaf, saya tidak dapat memproses masalah tersebut. Mari bermula dari awal.",
      steps: {
        start: {
          title: "Adakah Raspberry Pi anda dapat dihidupkan?",
          description: "Mari kita periksa sama ada Raspberry Pi mendapat sebarang bekalan kuasa.",
          icon: <Power className="w-12 h-12 text-[#206a5d]" />,
          options: [
            { label: "Ya, ia hidup!", next: 'led_check', color: 'bg-[#206a5d]' },
            { label: "Tidak, ia senyap.", next: 'plug_in', color: 'bg-slate-700' }
          ]
        },
        plug_in: {
          title: "Memeriksa Soket/Suis",
          description: "Pastikan perkakasan disambungkan secara fizikal ke punca kuasa.",
          icon: <Zap className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Sahkan kabel kuasa dipasang dengan kemas pada Raspberry Pi dan soket dinding.",
          image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1000", 
          options: [
            { label: "Baik, saya sudah sambung!", next: 'led_check', color: 'bg-[#206a5d]' }
          ]
        },
        led_check: {
          title: "Memeriksa Lampu Butang 'Power'",
          description: "Lihat pada perkakasan Raspberry Pi. Terdapat lampu pada butang 'power' di sisi Raspberry Pi.",
          icon: <Palette className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Apakah warna lampu pada butang 'power' Raspberry Pi?",
          image: "https://www.raspberrypi.com/documentation/computers/images/Pi5-annotated-top.png",
          options: [
            { label: "Kuning (Berkelip/Tetap)", next: 'use_check', color: 'bg-yellow-600' },
            { label: "Merah (Tetap)", next: 'press_button', color: 'bg-red-600' },
            { label: "Tiada lampu langsung", next: 'swap_psu', color: 'bg-slate-600' }
          ]
        },
        press_button: {
          title: "Tekan Butang Kuasa",
          description: "Lampu merah bermaksud Raspberry Pi berada dalam mod 'standby' dan belum dihidupkan.",
          icon: <Fingerprint className="w-12 h-12 text-red-500" />,
          instruction: "Tekan butang kuasa di sisi perkakasan Raspberry Pi dengan kuat sekali.",
          image: "https://www.raspberrypi.com/documentation/computers/images/Pi5-annotated-side.png",
          options: [
            { label: "Ia bertukar Kuning!", next: 'use_check', color: 'bg-[#206a5d]' },
            { label: "Masih Merah / Tiada perubahan", next: 'swap_psu', color: 'bg-slate-700' }
          ]
        },
        swap_psu: {
          title: "Tukar Bekalan Kuasa",
          description: "Bekalan kuasa atau kabel semasa mungkin rosak.",
          icon: <RefreshCw className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Cuba tukar bekalan kuasa/kabel Raspberry Pi dengan yang lain.",
          options: [
            { label: "Saya nampak lampu sekarang!", next: 'led_check', color: 'bg-[#206a5d]' },
            { label: "Masih tiada lampu langsung", next: 'pi_faulty_result', color: 'bg-red-600' }
          ]
        },
        pi_faulty_result: {
          type: 'result',
          status: 'error',
          title: "Diagnosis: Kerosakan Perkakasan",
          description: "Memandangkan Raspberry Pi tidak menunjukkan lampu walaupun selepas menukar kabel kuasa, Raspberry Pi itu sendiri mungkin rosak.",
          recommendation: "Perkakasan Raspberry Pi perlu diganti. Sila labelkan unit ini sebagai 'Rosak' (Faulty) dan hubungi staf dari PSC.",
          icon: <AlertCircle className="w-16 h-16 text-red-600" />
        },
        use_check: {
          title: "Pemeriksaan Kebolehgunaan",
          description: "Lampu berwarna kuning, petanda yang bagus untuk perkakasan!",
          icon: <Cpu className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Adakah anda dapat menggunakan komputer (nampak desktop, gerakkan tetikus)?",
          options: [
            { label: "Ya, saya boleh gunakannya!", next: 'os_confirmation', color: 'bg-[#206a5d]' },
            { label: "Tidak, saya masih tidak boleh menggunakannya.", next: 'monitor_check', color: 'bg-slate-700' }
          ]
        },
        os_confirmation: {
          title: "Pengesahan Sistem",
          description: "Sahkan bahawa sistem operasi telah dimuatkan sepenuhnya.",
          icon: <Layout className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Adakah anda dapat melihat desktop Raspberry Pi OS sepenuhnya (menu, kertas dinding, dan ikon)?",
          options: [
            { label: "Ya, semuanya berfungsi!", next: 'it_works', color: 'bg-[#206a5d]' },
            { label: "Tidak, saya tidak nampak desktop", next: 'sd_reformat', color: 'bg-orange-600' }
          ]
        },
        monitor_check: {
          title: "Adakah Skrin Menunjukkan Apa-apa?",
          description: "Perkakasan hidup, tetapi monitor bermasalah.",
          icon: <Monitor className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Lihat pada skrin monitor anda. Adakah anda melihat sebarang teks, warna, atau desktop?",
          options: [
            { label: "Ya, saya nampak sesuatu (tapi tidak berfungsi dengan betul)", next: 'sd_reformat', color: 'bg-orange-500' },
            { label: "Tidak, ia hitam sepenuhnya.", next: 'monitor_hdmi_check', color: 'bg-slate-700' }
          ]
        },
        monitor_hdmi_check: {
          title: "Penyelamatan Monitor: Semak HDMI",
          description: "Mari periksa sambungan antara Pi and skrin monitor.",
          icon: <Settings className="w-12 h-12 text-slate-500" />,
          instruction: "1. Pastikan monitor dihidupkan. 2. Cabut dan pasang semula kabel HDMI dengan kemas. 3. Jika masih tidak berjaya, gantikan dengan kabel HDMI yang berlainan.",
          image: "https://images.unsplash.com/photo-1629739682536-3990664972f7?auto=format&fit=crop&q=80&w=1000",
          options: [
            { label: "Ia berfungsi sekarang!", next: 'os_confirmation', color: 'bg-[#206a5d]' },
            { label: "Masih nampak skrin hitam.", next: 'monitor_swap_check', color: 'bg-slate-700' }
          ]
        },
        monitor_swap_check: {
          title: "Penyelamatan Monitor: Tukar Skrin",
          description: "Kabel berfungsi, tetapi monitor itu sendiri mungkin bermasalah.",
          icon: <Monitor className="w-12 h-12 text-slate-500" />,
          instruction: "Sambungkan perkakasan Raspberry Pi ke monitor lain yang anda tahu berfungsi.",
          options: [
            { label: "Ia berfungsi pada skrin baru!", next: 'os_confirmation', color: 'bg-[#206a5d]' },
            { label: "Masih tiada apa-apa pada mana-mana skrin", next: 'monitor_fail_result', color: 'bg-orange-500' },
            { label: "Skrin hidup, tetapi tidak dapat melihat sistem operasi Raspberry Pi.", next: 'sd_reformat', color: 'bg-blue-700' }
          ]
        },
        monitor_fail_result: {
          type: 'result',
          status: 'warning',
          title: "Diagnosis: Monitor atau Kabel Rosak",
          description: "Kabel HDMI asal atau monitor itu sendiri nampaknya telah rosak.",
          recommendation: "Gantikan kabel HDMI dahulu. Jika masalah berterusan, monitor perlu diganti. Hubungi ketua program PSC untuk urusan penggantian.",
          icon: <Monitor className="w-16 h-16 text-orange-500" />
        },
        sd_reformat: {
          title: "Pemeriksaan 'Otak': Fasa 1 (Perisian)",
          description: "Perkakasan hidup, tetapi perisian pada kad mungkin rosak.",
          icon: <Laptop className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Ikuti langkah-langkah ini dengan menggunakan komputer lain:",
          detailedSteps: [
            { text: "Buka 'Raspberry Pi Imager'.", link: "https://www.raspberrypi.com/software/" },
            { text: "Pilih Peranti (Device): Raspberry Pi 5", bold: true },
            { text: "Pilih OS: Raspberry Pi OS (64-bit)", bold: true },
            { text: "Tetapan lain (hostname, localisation, dll.) adalah pilihan.", bold: true }
          ],
          image: "https://www.raspberrypi.com/documentation/computers/images/imager-v1.8.png",
          options: [
            { label: "Selesai! Desktop nampak.", next: 'sd_corrupted_result', color: 'bg-[#206a5d]' },
            { label: "Dah format tapi masih tak masuk OS", next: 'sd_swap', color: 'bg-slate-700' }
          ]
        },
        sd_corrupted_result: {
          type: 'result',
          status: 'success',
          title: "Diagnosis: Kad microSD Korup",
          description: "Perkakasan Raspberry Pi anda dalam keadaan baik, tetapi data pada kad microSD telah korup.",
          recommendation: "Proses format semula telah membaiki isu perisian. Sentiasa gunakan 'Shut Down' dari menu Pi sebelum menutup bekalan kuasa.",
          icon: <FileWarning className="w-16 h-16 text-[#206a5d]" />
        },
        sd_swap: {
          title: "Pemeriksaan 'Otak': Fasa 2 (Perkakasan)",
          description: "Jika format tidak membantu, kad fizikal mungkin rosak.",
          icon: <HardDrive className="w-12 h-12 text-[#206a5d]" />,
          instruction: "Tukar ke kad microSD lain yang anda tahu berfungsi (pinjam dari setup yang berjaya).",
          options: [
            { label: "Berjaya! Desktop nampak.", next: 'sd_faulty_result', color: 'bg-[#206a5d]' },
            { label: "Kad baru pun gagal", next: 'sd_pi_fail_result', color: 'bg-red-600' }
          ]
        },
        sd_faulty_result: {
          type: 'result',
          status: 'success',
          title: "Diagnosis: Kerosakan Kad microSD",
          description: "Kad microSD anda sebelum ini berkemungkinan besar mengalami kerosakan fizikal atau korupsi kekal.",
          recommendation: "Memandangkan kad baru berfungsi, kad lama anda perlu diganti. Sila labelkan kad lama sebagai 'Rosak' dan gunakan kad baru.",
          icon: <HardDrive className="w-16 h-16 text-[#206a5d]" />
        },
        sd_pi_fail_result: {
          type: 'result',
          status: 'error',
          title: "Diagnosis: Kegagalan Perkakasan",
          description: "Kami telah memeriksa monitor, kabel, dan berbilang kad microSD.",
          recommendation: "Memandangkan kad microSD yang baru juga gagal, perkakasan Raspberry Pi itu sendiri mungkin mempunyai kerosakan dan perlu diganti.",
          icon: <AlertCircle className="w-16 h-16 text-red-600" />
        },
        it_works: {
          type: 'result',
          status: 'success',
          title: "Sistem Berfungsi Sepenuhnya",
          description: "Perkakasan Raspberry Pi anda telah sedia. Selamat menggunakannya!",
          recommendation: "Ingat untuk sentiasa tutup (Shut Down) dengan betul dari menu sebelum mencabut palam.",
          icon: <CheckCircle2 className="w-16 h-16 text-[#206a5d]" />
        }
      }
    }
  };

  const analyzeProblem = async () => {
    if (!userInput.trim()) return;
    setIsAnalyzing(true);
    setErrorMessage(null);
    const systemPrompt = `Analyze issue and return ONLY the key: 'plug_in', 'led_check', 'monitor_check', 'sd_reformat', or 'start'.`;
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: userInput }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
      });
      const data = await response.json();
      const resultKey = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
      if (['plug_in', 'led_check', 'monitor_check', 'sd_reformat', 'start'].includes(resultKey)) {
        setHistory([...history, step]);
        setStep(resultKey);
      } else { setStep('start'); }
    } catch (err) { setErrorMessage(content[lang].aiError); } finally { setIsAnalyzing(false); }
  };

  const handleNext = (nextStep) => {
    setHistory([...history, step]);
    setStep(nextStep);
  };

  const reset = () => {
    setStep('start');
    setHistory([]);
    setUserInput('');
    setErrorMessage(null);
  };

  const current = content[lang].steps[step];
  const t = content[lang];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans transition-all duration-500 pb-16">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;700&display=swap');
        .font-serif { font-family: 'DM Serif Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .bg-psc { background-color: #206a5d; }
        .text-psc { color: #206a5d; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />

      <header className="bg-white border-b px-8 py-5 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-psc p-2.5 rounded-xl shadow-lg shadow-emerald-900/20 text-white">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-slate-900 leading-none">{t.header}</h1>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{t.subHeader}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setLang(lang === 'en' ? 'ms' : 'en')} className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:border-psc hover:text-psc transition-all">
            <Languages className="w-4 h-4" /> {lang === 'en' ? 'Bahasa Melayu' : 'English'}
          </button>
          <button onClick={reset} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-600 transition-colors group">
            <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" /> {t.startOver}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {/* LOGO SECTION ABOVE WINDOW */}
        <div className="flex items-center justify-center gap-12 mb-12 opacity-80">
           <div className="flex flex-col items-center gap-2">
             <div className="h-14 w-40 flex items-center justify-center border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-300 uppercase tracking-tighter text-center px-4">
               Penang Science Cluster Logo
             </div>
           </div>
           <div className="h-12 w-px bg-slate-200" />
           <div className="flex flex-col items-center gap-2">
             <div className="h-14 w-40 flex items-center justify-center border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-300 uppercase tracking-tighter text-center px-4">
               MakerLab Logo
             </div>
           </div>
        </div>

        <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100 animate-slide-up">
          {!current.type && (
            <div className="h-1.5 w-full bg-slate-100 flex">
               <div 
                className="h-full bg-psc transition-all duration-700 ease-out" 
                style={{ width: `${Math.min((history.length + 1) * 12, 100)}%` }}
               />
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="mb-6 transform hover:scale-110 transition-transform duration-300 p-6 bg-emerald-50 rounded-3xl">
                {current.icon}
              </div>
              <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">{current.title}</h2>
              <p className="text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed">{current.description}</p>
            </div>

            {step === 'start' && (
              <div className="mb-8 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 group focus-within:border-blue-300 transition-all relative shadow-inner">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    Optional / Pilihan
                  </span>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                    {t.aiLabel}
                  </label>
                </div>
                
                <textarea 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={t.aiPlaceholder}
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 resize-none h-20 mb-3 font-sans"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Info className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium leading-none">AI will jump to the best step</span>
                  </div>
                  <button 
                    onClick={analyzeProblem}
                    disabled={!userInput.trim() || isAnalyzing}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-slate-900 transition-all shadow-md active:scale-95"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                    )}
                    {t.aiButton}
                  </button>
                </div>
                {errorMessage && (
                  <p className="mt-2 text-xs text-red-500 font-medium">{errorMessage}</p>
                )}
              </div>
            )}

            {current.instruction && (
              <div className="bg-[#206a5d]/5 border border-[#206a5d]/10 rounded-[2rem] p-8 mb-10 overflow-hidden shadow-inner">
                <div className="flex gap-4 mb-4">
                  <div className="bg-psc p-3 h-fit rounded-2xl shadow-lg shadow-emerald-900/10 text-white">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-xl text-psc mb-2">{t.mission}</h4>
                    <p className="text-slate-600 text-lg leading-relaxed">{current.instruction}</p>
                  </div>
                </div>

                {current.image && (
                  <div className="mb-4 mt-2 rounded-xl overflow-hidden border-4 border-white shadow-xl bg-white">
                    <img 
                      src={current.image} 
                      alt="Guide" 
                      className="w-full h-auto object-cover max-h-64"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
                
                {current.detailedSteps && (
                  <ul className="space-y-3 pl-10 border-l-2 border-psc/20 ml-4 py-1">
                    {current.detailedSteps.map((s, i) => (
                      <li key={i} className="text-slate-600 text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-psc rounded-full shrink-0 mt-1.5" />
                        <span className={s.bold ? "font-bold" : ""}>{s.text}</span>
                        {s.link && (
                          <a 
                            href={s.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1 ml-2 text-psc font-bold hover:underline"
                          >
                            Download <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {current.type === 'result' ? (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
                  <h4 className="font-serif text-2xl text-slate-900 mb-4 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-psc" /> {t.recommendation}
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {current.recommendation}
                  </p>
                </div>
                <button 
                  onClick={reset}
                  className="w-full py-6 rounded-2xl bg-psc text-white font-bold text-lg hover:brightness-110 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <RotateCcw className="w-5 h-5 group-hover:rotate-[-45deg] transition-transform" /> {t.startOver}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {current.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleNext(option.next)}
                    className={`${option.color} text-white p-6 rounded-2xl font-bold text-lg shadow-xl hover:brightness-110 hover:-translate-y-1 transition-all flex items-center justify-between group`}
                  >
                    <span>{option.label[lang] || option.label}</span>
                    <div className="bg-white/20 p-2 rounded-xl">
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 text-center">
        <p className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.3em]">{t.footer}</p>
      </footer>
    </div>
  );
};

export default App;