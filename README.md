# LeafSound




## Project Description

LeafSound is an integrated and intuitive platform designed to function as a complete musical notepad. It allows musicians, students, and enthusiasts to centralize all their music-related activities in a single digital environment. Key functionalities include creating and editing textual annotations, inserting and organizing images, uploading and managing audio files, intuitively creating musical chords with flexible positioning over lyrics, and fully customizing tablatures.

One of LeafSound's differentiators is its holistic approach to musical content management, combining functionalities that would traditionally be dispersed across different applications. The interface was designed with a focus on simplicity and intuitiveness, making it accessible to both beginners and experienced professionals. Furthermore, the system offers customization of tablature presentation, adapting to different musical styles and personal preferences, providing a unique and tailored experience for each user.




## Features

LeafSound offers a range of essential functionalities for music management:

### Functional Requirements

*   **[RF001] Registration:** The system must allow the user to register, providing basic data such as name, email, and password, for personalized access to the platform.
*   **[RF002] Login:** The system must authenticate the user, allowing access to the musical content creation and management environment.
*   **[RF003] Note Creation:** The user must be able to create personalized textual annotations to record musical ideas, studies, lyrics, or instructions.
*   **[RF004] Chord Creation:** The system must allow the creation and editing of chords with flexible positioning over lyrics, in a simplified way.
*   **[RF005] Automatic Scrolling:** The system must offer automatic scrolling of chords, allowing musicians to follow the music without manual interaction.
*   **[RF006] Workspace:** The environment must allow the organization of musical projects in independent workspaces, facilitating content access and categorization.
*   **[RF007] File Import:** The system must allow users to import files such as PDFs, images, and audios to complement their annotations.
*   **[RF008] Profile Customization:** The user will be able to personalize their profile with information, photo, and visual preferences of the environment.
*   **[RF009] Sound Tools:** The system must provide sound support tools such as metronome, BPM adjustment, and chord playback simulation (without real sound).

### Non-Functional Requirements

*   **[RNF001] Web Access:** The system must be available via a modern web browser, without the need for local installation.
*   **[RNF002] User-Friendly Interface:** The system interface must be clear and intuitive, using modern components like shadcn/ui to ensure good usability.
*   **[RNF008] Backup:** The system must perform periodic backups of user data to prevent losses in case of failures.
*   **[RNF009] Cloud Storage:** All data must be stored in the cloud, allowing remote and secure access at any time.
*   **[RNF010] Performance:** The system must offer fast response times and fluid navigation, even with multiple files loaded.
*   **[RNF011] Email and Password Login:** Authentication must be done via email and password registered by the user, ensuring secure access to the system.
*   **[RNF012] Google Account Authentication:** The system must allow login with a Google Account, facilitating access and reducing entry barriers.
*   **[RNF013] Password Creation Policy:** Passwords must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and symbols.
*   **[RNF014] Protection Services:** The system must implement two-step authentication and other security measures to protect user data.
*   **[RNF015] Database:** The database used must be PostgreSQL, offering robustness, scalability, and data integrity.
*   **[RNF016] System Language:** The system must be developed with TypeScript, JavaScript, and Python, using the Next.js framework.


[Visual Prototype - Made in Figma](https://imgur.com/gallery/leafsound-prototype-Hw9VvON)


## Technologies Used

LeafSound is built with the following technologies:

*   **Frontend:** TypeScript, JavaScript, Next.js, shadcn/ui
*   **Backend:** Python
*   **Database:** PostgreSQL



