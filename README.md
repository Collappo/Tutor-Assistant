# ✨ Asystent Korepetycji 🎓

Asystent Korepetycji to chludna i nowoczesna aplikacja internetowa do zarządzania Twoją pracą dydaktyczną.
Umożliwia prowadzenie bazy uczniów, planowanie harmonogramu lekcji (w tym cyklicznych) oraz automatyczne 
śledzenie zarobków – wszystko lokalnie i bezpiecznie w Twojej przeglądarce.

Aplikacja powstała przy wsparciu ***Gemini*** od **Google** (model *`gemini-3-flash-preview`*)

---

## 🛠️ Funkcje

- **Inteligentny Dashboard** – automatyczne statystyki zarobków (tygodniowe i całkowite) oraz lista nadchodzących zajęć.
- **Zarządzanie Uczniami** – wygodna baza z danymi kontaktowymi, przedmiotami i poziomem nauczania.
- **Harmonogram Cykliczny** – planowanie serii lekcji jednym kliknięciem (np. co tydzień do końca semestru).
- **Personalizacja** – 4 nowoczesne motywy kolorystyczne (Fiolet, Szmaragd, Niebieski, Bursztyn).
- **Schludny wygląd** – ciemny, elegancki interfejs zoptymalizowany pod urządzenia mobilne.

---

## 👥 Dla kogo?

- niezależni korepetytorzy
- nauczyciele prywatni
- lektorzy językowi
- studenci udzielający pomocy w nauce

---

## 🚀 Jak zacząć?

1.  **Dodaj pierwszego ucznia** w zakładce "Uczniowie".
2.  **Zaplanuj lekcję** w zakładce "Lekcje" – możesz wybrać opcję cykliczną, aby system sam uzupełnił Twój kalendarz na nadchodzące miesiące.
3.  **Monitoruj postępy** na Dashboardzie, gdzie automatycznie pojawią się statystyki Twoich zarobków po oznaczeniu lekcji jako "Wykonane".

---

## 🛠️ Technologie

- ⚛️ **React**
- ⚡ **Vite**
- 🟦 **TypeScript**
- 🎨 **Tailwind CSS**
- 📊 **Recharts**
- 🧩 **Lucide Icons**

---

## 🔐 Bezpieczeństwo i prywatność danych

Aplikacja stawia na prywatność – nie zbiera, nie przesyła i nie przechowuje Twoich danych na żadnym zewnętrznym serwerze.
Wszystkie informacje są zapisywane wyłącznie w `localStorage` Twojej przeglądarki, co wiąże się z określonymi cechami:

- **Brak synchronizacji między urządzeniami**  
  Dane zapisane na komputerze nie będą widoczne na telefonie (i odwrotnie).
  
- **Ryzyko utraty danych**  
  Wyczyszczenie pamięci podręcznej przeglądarki lub używanie trybu incognito spowoduje bezpowrotną utratę wpisanych danych.

- **Dostęp lokalny**  
  Dane są przechowywane w postaci jawnej w przeglądarce. Zalecamy nieudostępnianie urządzenia osobom trzecim.

- **Ochrona przed XSS**  
  Aplikacja stosuje nowoczesne techniki renderowania React, aby minimalizować ryzyko wstrzyknięcia złośliwego kodu.

---