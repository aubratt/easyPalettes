# easyPalettes

## Overview
easyPalettes is a free, intuitive color palette generation tool designed for designers, artists, creators, developers, marketers, and anyone working with color. The site emphasizes simplicity, ease of use, and responsiveness, delivering a smooth user experience combined with practical functionality. Its interactive palette builder provides immediate visual feedback as users input or adjust colors, making the process feel fluid, dynamic, satisfying, and creatively engaging.

Users can create palettes of up to eight colors using HEX, RGB, or HSL codes, an eyedropper tool, or an interactive color slider. The drag-and-drop feature lets users rearrange colors freely, giving full control over the palette’s order and flow. To help spark inspiration, easyPalettes offers 12 unique randomizers, each based on common color relationships like complementary, analogous, or triadic schemes, enabling users to explore curated combinations or simply break creative blocks. Once a palette is complete, users can name and save it to their profile for easy access or future reference.

The Browse page showcases palettes created by the community, allowing users to explore diverse ideas and trends. Logged-in users can like palettes they find inspiring, which are then saved to their profile for quick retrieval—helpful for organizing inspiration or revisiting favorite color sets when working on different projects.

I created easyPalettes out of a genuine fascination with color, color combinations, and color theory. While I'm far from an expert in these areas, I saw this project as an opportunity to learn and grow both creatively and technically. I wanted to build something that not only helped me explore concepts like HEX, RGB, and HSL formats, but also provided a useful, focused tool for others who work with color, whether professionally or just for fun.

My inspiration for easyPalettes came primarily from [Coolors.co](https://coolors.co/), a site I remember discovering and instantly falling in love with. I was drawn in by the way it handled color generation—the randomizer, the interactivity, the smoothness of the palette builder, and the wealth of color information all felt incredibly satisfying and creatively inspiring. It sparked my interest in color theory and made me realize how much fun working with color could be.

But as much as I admired Coolors, I also saw areas where it left me wanting more. Several useful features—like using randomizers based on color theory (complementary, analogous, etc.)—are locked behind a paywall. I also found the mobile version of the palette generator to be limited and not nearly as user-friendly. For example, you can’t add or remove colors from your palette on mobile, and it’s not obvious that you can change colors at all. When you try, the interactivity can be finnicky or frustrating.

With easyPalettes, I wanted to take the parts of Coolors that I loved—the satisfying functionality, the visual feedback, the focus on color—and recreate them in a tool that remained completely free and worked just as well on mobile as it does on desktop. All the features of the palette builder, including randomizers, sliders, drag-and-drop, and multiple input types, are fully usable across devices. While Coolors is obviously a much more advanced tool overall—with more features, more polish, and more depth—I saw an opportunity to create something accessible, functional, and smooth that could match many of its core features while improving on mobile experience and staying open to everyone.

As a developer looking to grow in frontend development, I also see easyPalettes as the foundation for something much bigger—a potential color and design hub for creators. There’s room to expand with features like a contrast checker, deeper color info, color theory resources, and more. At its core though, easyPalettes is meant to stay accessible, intuitive, and creatively fun for everyone, regardless of experience level.

Whether you're developing a brand, designing a product, building a website, or just playing with color, easyPalettes offers a lightweight, practical, and engaging tool for generating palettes and exploring creativity.

---

## Distinctiveness and Complexity
easyPalettes is a fully custom-built color palette generation platform that significantly exceeds the scope and complexity of any of the course projects. It includes three Django models--User, Palette, and Like--to support persistent user-generated content and interaction. The site integrates Django backend logic with a dynamic JavaScript frontend, handling real-time interactivity, user input, color data manipulation, and responsive UI behavior within a cohesive and self-contained system.

Unliked Project 0: Search, which relies on an external API for its core functionality, easyPalettes performs all logic internally. It handles palette generation, color transformation, data persistence, and user interaction entirely within the application. Project 1: Wiki remains structurally simple, with file-based storage and no user accounts. In contrast, easyPalettes supports full user authentication and structured database storage, with advanced logic for managing unique palettes, preventing duplicate palette names per account, and linking content to individual users.

Project 2: Mail introduces JavaScript and asynchronous behavior but is limited to relatively straightforward features like archiving and replying. easyPalettes uses similar technologies but applies across a more interactive and visual domain. It coordinates color input syncing, client-side color validation, and dynamic updates using JavaScript and Bootstrap components in ways that are more involved than simple mail handling.

Project 3: Commerce introduces more data types and features, such as listings, bidding, categories, and watchlists, but lacks JavaScript or API integration. Its complexity lies primarily in view logic and Django templates. easyPalettes handles a similar volume of data--palettes, colors, likes--but adds client-side interactivity, modals, drag-and-drop, and more advanced user feedback mechanisms. Commerce doesn't deal with real financial transactions or logistics, limiting its real-world applicability. easyPalettes, by contrast, includes complete CRUD operations for palettes, data validation, and user interaction in a way that's both visually engaging and technically layered.

Project 4: Network comes closest in structure, with its account system and liking functionality. However, it's essentially a text-based social app. easyPalettes expands on this model, adding richer data structures such as arrays of color values, more complex interactions, and deeper UX considerations. Rather than simple text posts, users create multi-value palettes that require detailed rendering, syncing, and manipulation.

easyPalettes was also designed visually and structurally with mobile users in mind. It employs responsive design practices using CSS media queries and Bootstrap layout components to adjust UI behavior across screen sizes. JavaScript interactions are implemented for both desktop and touch devices, including mobile drag-and-drop functionality—something none of the course projects required or demonstrated. The app’s responsiveness, clean layout, and intuitive controls contribute to a polished, professional user experience.

easyPalettes presents a substantially more advanced and complete application than any of the course projects. It demonstrates full-stack development, thoughtful UX design, and extensive real-world functionality. With multiple Django models, dynamic client-server interaction, mobile-first design, and a wide range of user-facing features, it reflects a level of complexity and completeness that goes well beyond the project baseline.

---

## File Descriptions
### `palettes/urls.py`
The `urls.py` file defines all the URL patterns that allow users to navigate the application. It maps routes to view functions, enabling the frontend and backend to work together seamlessly. This includes paths for core functionality such as the homepage, login, logout, registration, palette creation, browsing, and profile views.

This file makes use of core Django routing principles covered in the course, such as dynamic URL segments (e.g., `<str:username`> and `<int:palette_id>`) to render user-specific or palette-specific pages based on shared templates. Each route is also named using Django’s name attribute, which supports cleaner and more maintainable URL referencing in templates and redirects.

In addition to basic routing, this file also integrates:
- **Django’s built-in password reset system** (`django.contrib.auth.views`), which enables users to reset their passwords through a secure multi-step process.
- **Infinite scroll pagination** functionality, powered by [django-infinite-scroll-pagination](https://pypi.org/project/django-infinite-scroll-pagination/) by [nitely](https://github.com/nitely), allowing content to load dynamically as the user scrolls down, improving UX and reducing load times.

`urls.py` plays a central role in the structure of the application, acting as the connective tissue between user requests and the views responsible for rendering dynamic content.

### `palettes/views.py`
The `views.py` file contains the core logic for rendering all user-facing views and handling key functionality in the application. It works closely with `urls.py` to ensure that HTTP requests are routed correctly and processed with appropriate logic. This file is responsible for supporting critical user actions such as registering, logging in, logging out, creating and deleting palettes, liking palettes, and retrieving dynamic content for modal displays.

The views make extensive use of Django’s core features covered in the course, including:
- `authenticate()` and `login()` from `django.contrib.auth` for secure user authentication.
- `IntegrityError` from `django.db` to prevent duplicate user registrations.
- `JsonResponse` and `JsonDecodeError` to handle client-side JavaScript interactions and validate palette data sent via AJAX.
- Querying and filtering model objects using Django ORM syntax (e.g., `filter(user=request.user)` or `filter(palette=palette)`) to retrieve data relevant to each user or page.
- Template rendering via `render()` to pass context-specific variables to static HTML templates.

In addition to standard Django views, this file plays a significant role in two advanced features of the site:
- **Infinite Scroll Pagination**: `views.py` implements vertical scroll pagination using the [django-infinite-scroll-pagination](https://pypi.org/project/django-infinite-scroll-pagination/) package by [nitely](https://pypi.org/project/django-infinite-scroll-pagination/). This integration allows users to browse palettes continuously without needing to reload the page. It uses encoded page keys via the `base64` module, along with serializers and paginators provided by the package.
- **Palette Detail Modals**: The view `palette_detail_json` enables palette detail modals by returning palette information as JSON. This allows JavaScript to populate modals dynamically when users click on a palette, enhancing user experience with a seamless, single-page interaction model.

`views.py` functions as a bridge between backend logic and frontend interactivity. It ensures that data from the database is securely and efficiently accessed, validated, serialized (when needed), and passed into templates or returned to JavaScript to drive a responsive and interactive interface.

### `palettes/static/palettes/script.js`
The `script.js` file is the largest and most complex file I created, underpinning nearly all user interactions and dynamic UI behaviors across the site. It tightly integrates with `views.py` and frontend HTML templates to deliver a seamless, responsive user experience.

#### Core Responsibilities
- **Color Format Conversion and Palette Manipulation**: The file includes utility functions that convert colors between HEX, RGB, and HSL formats, fundamental for displaying accurate color values and enabling precise color calculations. It also implements various color palette randomization algorithms that empower users to generate aesthetically coherent palettes on demand.
- **Dynamic Palette Creation and Real-Time UI Updates**: Functions such as `changeColor` and `handleInputBlur` monitor user input in the color text fields. They sanitize and normalize color codes (including expanding shorthand HEX), update the background colors of palette columns instantly, and synchronize these with color picker sliders (`form-control-color`). This bidirectional binding ensures that any input method—typing or selecting—reflects immediately across the interface. Also, the `toggleInputStyle` function continuously evaluates the luminance of each color column’s background and adjusts text and button colors to guarantee sufficient contrast and readability, enhancing usability and visual appeal.
- **Palette Persistence and Session Management**: To maintain user progress and preferences within a session, the file uses `sessionStorage` to store the last valid HEX values for each color column via `saveLastValidHex` and retrieves them with `getLastValidHex`. The `normalizeAllColorInputs` function initializes or restores the UI based on stored data, ensuring users can resume palette editing without losing their work.
- **User Interaction Handlers and Event Listeners**: `script.js` attaches essential event listeners to handle all major user actions, including:
    - Adding/removing colors dynamically, with live HTML generation to reflect changes in the palette structure.
    - Mouseover and mouseout listeners show or hide add/remove buttons on color columns for a cleaner interface.
    - The randomize dropdown and button enable users to trigger palette randomization modes easily.
    - Copy-to-clipboard icons allow users to copy HEX, RGB, and HSL codes from palette details.
    - Like buttons invoke `likePalette`, which performs asynchronous fetch requests to backend APIs, updating like counts and button states in real time, with `localStorage` caching to optimize user experience.
    - Save palette functionality employs a submit event listener and related logic to send palette data to the server, tying front-end actions to backend persistence.
    - Delete and view details buttons manage modals and palette state, invoking server data fetches and dynamic modal construction.
- **Drag-and-Drop Reordering of Colors**: The `attachDragHandlers` function enables intuitive drag-and-drop rearrangement of color columns on desktop, updating the DOM order instantly and persisting changes. The code accounts for correct insertion logic and prevents invalid nesting, ensuring smooth user control over palette layout.
- **Modal Generation and Palette Detail Views**: The app uses `handlePaletteModal` and `buildPaletteModalHTML` to fetch palette details asynchronously and construct modals dynamically. These modals display color information in HEX, RGB, and HSL formats alongside copy controls, with adaptive styling for readability based on background luminance.
- **Infinite Scroll Pagination for Smooth Browsing**: Through a scroll event listener combined with the `checkAndLoadMore` function, the script implements infinite scrolling. This loads additional palettes asynchronously when the user nears the bottom of the palette grid, minimizing load times and improving browsing fluidity. The `getLastPaletteInfo` function encodes pagination keys from the last loaded palette’s timestamp and ID to request correct data batches from the backend.
- **UI State Management and Accessibility Enhancements**: The `toggleAddRmvBtns` function dynamically manages the visibility and interactivity of add and remove buttons based on palette size constraints, enforcing minimum and maximum limits. `bottomRowDetection` identifies palettes positioned in the bottom row of the grid and converts dropdown menus to “dropup” style to prevent overflow outside the viewport, enhancing accessibility and user experience.

`script.js` is the foundational front-end file driving nearly all interactive and dynamic elements of the site’s palette management system. Its extensive collection of functions manages color processing, user input sanitization, drag-and-drop behavior, palette persistence, modal detail display, like system synchronization with backend APIs, and infinite scroll pagination. By orchestrating these capabilities, it tightly couples the client and server sides to deliver a polished, intuitive, and highly responsive user experience.

### `palettes/static/palettes/styles.css`
While much of easyPalettes' visual design is handled by Bootstrap and some inline HTML styling, the `styles.css` file plays a major role in shaping the app’s layout and feel. Admittedly, the styling across the project could be more consistent—there’s a mix of approaches, and it’s not the most efficient setup—but creating and managing this stylesheet gave me the chance to go beyond the basic styling covered in course projects. I wanted more control over the look and feel of easyPalettes, and I think this file reflects my effort to take ownership of the design and build something more custom and polished.

The CSS file introduces layout and utility classes to help with spacing, widths, and viewport-based heights. It defines a responsive grid layout for displaying palettes, ensuring they’re shown cleanly across screen sizes with evenly spaced rows and columns. Each palette includes a color strip composed of equal-width blocks and a footer section where users can view the creator, like the palette, or interact with a dropdown options menu.

One of the more thoughtful elements in this file is the way it handles different screen types and input devices. Media queries detect screen size and pointer type, adjusting layout and behavior to suit the device. For example, certain controls like the add/remove color buttons only appear on hover for users with pointer devices, but stay persistent on mobile.

Buttons, navbar links, and interactive elements use custom colors and hover effects that tie the interface together visually. Instead of relying on default Bootstrap styling, I customized elements with consistent background colors, gradients, and transitions. The green highlight color (#B7EB9B) is used consistently to draw attention to key actions and interactive elements.

Dropdowns and input fields are styled to match the dark background of the app, with subtle transitions and outlines that feel modern and intentional. Some view containers also use opacity and pointer-event properties to support smooth content switching, such as for tabbed content or infinite scroll.

Even though the styling isn’t perfectly organized or fully separated from inline code, I’m proud of how much I learned while building it. The result is a clean, modern UI that I designed and styled myself, and I think that shows a big step forward in how comfortable I’ve gotten working with CSS alongside HTML and JavaScript.

### `palettes/templates/palettes/layout.html`
The `layout.html` file serves as the base template for every page in the app. It defines the shared structure and styling for the site’s layout, navigation, and data attributes that drive frontend behavior. All other HTML templates extend this file to maintain a consistent user interface and experience.

This file plays several critical roles in the overall architecture of the site:
- **Navigation Bar**: The layout implements a fully responsive navbar using Bootstrap 5. On larger screens, navigation links are displayed horizontally. On smaller screens, the navigation collapses into a hamburger menu that opens a Bootstrap Offcanvas component. The links rendered in the navbar are dynamically controlled using `{% if user.is_authenticated %}`, allowing the site to show or hide links based on the user’s login state (e.g., showing “Login” and “Register” for anonymous users, or “Profile” and “Logout” for logged-in users).
- **Global Page Structure and Formatting**: All body content is wrapped inside a div with the ID `main-body-bg` and the Bootstrap class `container-fluid`, providing a uniform and padded layout for all pages. This wrapper is also styled to create visual distinction between the page’s background and content.
- **Template Blocks and Inheritance**: The file defines the `{% block title %}` and `{% block content %}` blocks that child templates can override. This allows pages like `browse.html`, `create.html`, and `profile.html` to reuse the structure while inserting their own titles and content.
- **Frontend–Backend Communication via Data Attributes**: The `<body>` tag stores key data using `data-` attributes, which are accessed in `script.js` to control behavior across pages:
    - **`data-page`**: Specifies the current page type (e.g., "browse" or "profile"), which is used to determine which JavaScript functions should run or how data should be loaded.
    - **`data-username`**: Indicates the profile being viewed, allowing the JavaScript to fetch the correct data when viewing user-specific pages.
    - **`data-user-authenticated`**: A boolean flag ("true" or "false") that tells the JavaScript whether the user is logged in. This enables the script to prompt login dialogs or disable certain actions for unauthenticated users.
- **Script and Style Loading**: The template links to essential third-party libraries including:
    - Bootstrap 5 CSS and JS bundles for styling and components.
    - Bootstrap Icons for interface icons (e.g., in buttons or modals).
    - Google Fonts (DM Sans) for consistent and modern typography.
    - A custom stylesheet (`styles.css`) for app-specific styles.
    - The script.js file, which powers dynamic behaviors throughout the site.

    Additionally, the layout imports and initializes `drag-drop-touch.esm.js` using ES module syntax. This polyfill enables drag-and-drop support on touch devices and works in tandem with drag features implemented in `script.js`.

By acting as a central template, `layout.html`  ensures consistent navigation, styling, and layout across all pages. It also provides the structural and data scaffolding needed by JavaScript to build interactive and personalized user experiences.

### `palettes/templates/palettes/index.html`
The `index.html` file is easyPalette’s home page. It’s designed to be simple, focused, and visually clean, acting as a welcoming introduction to the site.

All of the content is centered within a single rounded rectangle div, which is intentionally constrained to a fixed height. The page is non-scrollable by design, a choice made to keep the layout minimal and direct attention to the app’s two main features: browsing palettes and creating palettes.

Inside the rectangle, there’s a central catchphrase that introduces the site’s purpose, followed by a short paragraph and two call-to-action buttons. These buttons link users to the Browse and Create pages, encouraging them to jump right into interacting with the site.

`index.html` sets the tone for the rest of the experience—clean, focused, and easy to use. It doesn’t contain dynamic content or backend logic, but it plays a key role in shaping the first impression of the app.

### `palettes/templates/palettes/browse.html`
The `browse.html` template serves as the central discovery hub of easyPalettes, allowing users to explore all palettes created by members of the community. Its purpose is both practical and engaging: it presents palettes in a clean, responsive grid layout and integrates interactive features that bring the browsing experience to life.

At the top of the page is a bold header followed by a live-updating subheader showing the total number of palettes on the platform. This number is dynamically rendered using the `num_palettes` context variable passed from the view and reflects the current total every time the page is loaded. This small but interactive touch gives the page a feeling of liveliness and growth, subtly encouraging users to contribute and check back often.

Palettes are rendered in a responsive grid layout that adapts smoothly across screen sizes. Each palette appears as a rounded rectangle, split into two sections:
- **Top section (color strip)**: A horizontal row of color blocks representing the palette. The left and right corners are rounded for a sleek appearance.
- **Bottom section (palette footer)**: Displays metadata and controls:
    - The creator’s username, styled as a clickable link to their profile.
    - A like button (a white star icon), which users can click to favorite a palette. When liked, the icon changes to a filled star and the like count updates in real time. If the user is not logged in, clicking the icon redirects them to the login page.
    - A three-dots menu that opens a dropdown with additional actions. If the viewer is the creator of the palette, they see options to "View details" and "Delete palette." Other users only see "View details."
        - The "View details" option triggers a full-screen modal that displays the palette in a larger format. This modal showcases the creator’s username, the palette name, and each color’s HEX, RGB, and HSL values, along with copy buttons for each format. Text and icon colors are automatically styled based on background luminance to ensure readability, a detail handled by JavaScript.

While the template file itself focuses on static structure and layout, it provides the necessary HTML hooks and structure for advanced front-end features implemented in script.js. These include:
- Real-time like/unlike updates via AJAX.
- Modal generation for palette previews.
- Interactive dropdown behavior.
- Live deletion confirmation modals.
- Infinite scroll pagination (handled in script.js but driven by the data-time and data-id attributes in each .palette div).

By pairing a simple structure with rich interactivity, `browse.html` forms the core of user engagement in easyPalettes. It encourages exploration, interaction, and inspiration while laying the groundwork for more features in the future.

### `palettes/templates/palettes/create.html`
The `create.html` file powers easyPalette’s centerpiece feature: the palette maker. This is where users go to build custom color palettes, giving them full control over how many colors they want, what those colors are, and how they’re selected.

The page's layout is locked to the full height of the viewport, making the palette builder the sole focus. Users start with five colors by default but can add or remove color columns to create palettes ranging from 2 to 8 colors. Each column includes:
- A color block that shows the current color
- Add and remove buttons that appear on hover on desktop (persistent on mobile)
- A hex input box
- A Bootstrap color picker
- A clipboard button for copying the hex code

The layout is responsive: on large screens, colors display horizontally, while on smaller devices, they stack vertically. Regardless of layout, all interactive elements stay fully usable.

One of the core interactive tools is the randomizer button, which offers 12 different palette generation modes in the dropdown menu. These include standard color theory options (like analogous, complementary, and triadic) as well as aesthetic categories like pastel, vibrant, and neutral. Selecting a mode and clicking the Randomize button triggers JavaScript logic that applies the selected generation strategy to all visible colors.

At the top of the page is a Save button, which opens a modal where users can enter a name for their palette. Submitting the form sends a POST request to the server. The form includes a hidden input field that holds all the hex codes in the current palette. This field is filled in via JavaScript just before submission. The form is also protected by a CSRF token, consistent with Django security practices we learned in the course.

If a non-logged-in user clicks the save button, the view redirects them to the login screen. This is enforced by Django’s @login_required decorator in the corresponding view.

Nearly all the dynamic behavior on this page is handled by `script.js`, which:
- Initializes the palette by building the first set of color columns in the session
- Adds/removes columns when users click the appropriate buttons
- Syncs color pickers and hex inputs
- Applies color randomization based on the selected mode
- Updates the `#colors` hidden input before form submission
- Adjusts text color for contrast depending on background lightness

`create.html` is the visual and interactive core of the easyPalettes experience. The interface balances creativity and control, and the tight integration between HTML, JavaScript, and Django ensures that palette creation feels both smooth and intuitive.

### `palettes/templates/palettes/profile.html`
The `profile.html` file renders a user’s profile page and displays their color palettes. At the top of the page, the username is prominently displayed in large green text. Just below that, two interactive subheaders show how many palettes the user has created and, if they’re viewing their own profile, how many palettes they’ve liked. Clicking on either subheader toggles between the two views.

The active tab is highlighted in white, while the inactive one appears in light gray. This subtle styling change creates a clean, focused interface that adds just the right amount of liveliness to the profile without overwhelming the user. The "Liked" tab is a helpful touch, offering an easy way for users to return to palettes that inspired them.

Below the headers, palettes are displayed in a format identical to the `browse.html` page. Each palette sits in a rounded rectangle with a horizontal strip of color blocks on top and a footer underneath. The footer includes the palette creator’s username (linked to their profile), a like button, a like count, and an options menu.

The options menu includes a "View details" link for every user. If the user viewing the page is also the creator of the palette, a "Delete palette" option appears as well. Selecting that option triggers a modal that asks for confirmation before deletion.

The two views—created and liked—each have their own container (`#createdView` and `#likedView`), and the active one is shown based on which tab is selected. Both are styled to fit within the site’s consistent layout, and pagination is handled through infinite scroll, so new palettes load as the user scrolls down.

`profile.html` reuses and extends the functionality of the browse page, with a few extra interactive elements that personalize the experience. The layout is minimal, functional, and flexible enough to serve as a solid foundation for future profile features like collections or favorite colors. 

### `palettes/templates/palettes/login.html`
The login page is simple, clear, and responsive, making it easy to use on any screen size. It includes two input fields—one for the username and one for the password—each labeled with soft green text that matches the site’s color scheme. These fields are wrapped inside a centered card with consistent styling.

Below the form fields, there’s a login button styled in the same green shade, giving the page a clean and cohesive look. Underneath the button, users will find two helpful links: one to reset their password if they’ve forgotten it, and another to register if they don’t already have an account.

If a user was trying to access a protected page before logging in, that destination is preserved using a hidden input so they’ll be redirected there after a successful login.

The form uses Django’s CSRF protection to keep the login process secure. `login.html` is a straightforward and user-friendly login experience that fits seamlessly into the rest of the app.

### `palettes/templates/palettes/register.html`
The register page is clean, simple, and user-friendly. It allows new users to create an account by filling out four clearly labeled input fields: username, email, password, and confirm password. Each field is styled consistently and spaced for easy readability.

The form is centered on the page inside a transparent card, matching the visual layout used throughout the app. The "Register" button is styled in the same green color as other interactive elements to maintain design consistency.

Below the button, there’s a link that directs users to the login page in case they already have an account, making navigation intuitive.

The form uses Django’s built-in CSRF protection for security. `register.html` is functional, responsive, and visually in line with the rest of the app’s design. 

### `palettes/templates/palettes/password_reset.html`
If a user clicks the "Forgot Password" button on the login page, they are brought to this page—the first step in Django’s built-in password reset flow.

The page presents a single, clearly labeled input field where the user can enter their email address. It is centered on the screen in a transparent card layout, consistent with the design of other account pages.

Below the input field are two buttons. The send button submits the form and, if the entered email is associated with an account, triggers an email with password reset instructions and redirects the user to `password_reset_done.html`. The cancel button takes the user back to the login page.

This view uses Django’s CSRF protection and fits seamlessly into the overall styling and user experience of the site, keeping the password reset process simple and intuitive.

### `palettes/templates/palettes/password_reset_done.html`
After entering their email and clicking "Send" on `password_reset.html`, the user is redirected to this page, which displays a brief message encouraging them to check their inbox and follow the instructions to reset their password.

### `palettes/templates/palettes/password_reset_confirm.html`
In the email instructions, the user is provided with a link to this page and is directed to visit it in order to choose a new password. Upon arriving, they are shown two input fields: one for the new password and one for confirming it. After entering and confirming their new password, the user can click the "Reset Password" button to complete the process.

### `palettes/templates/palettes/password_reset_complete.html`
After clicking "Reset Password" on password_reset_confirm.html, the user is taken to this page briefly before being redirected to the login screen. It confirms that the password reset was successful and informs the user that they are being redirected. This is the final step in Django’s default password reset flow.

## How to Run the App


---

## Moving Forward
As this document highlights, easyPalettes is a simple yet effective tool that allows users to explore color, experiment with combinations, and engage with color theory in a satisfying and intuitive way. It provides a space for people to be creative and get inspired. While I’m proud of what it does now, I also see it as just the beginning. There’s a lot of room for growth—both in terms of practical features and creative possibilities—and I want easyPalettes to become something more than just a class project. I want it to be a real-world tool that’s useful, inspiring, and fun for anyone who works with color.

There are a number of quality-of-life improvements I could implement to enhance the user experience and bring the app closer to modern standards. These include letting users change their username, email, or password directly from their account settings, designing a custom password reset process that feels consistent with the rest of the app, and adding password strength requirements for better security. I’d also like to improve the overall accessibility and performance of the app by optimizing the frontend, minimizing load times, and making sure the interface works as smoothly as possible across devices. These improvements may not be flashy, but they’re important for building a tool that people can trust and enjoy using regularly.

At the same time, I want to keep building on the creative and educational side of the app—adding new tools, features, and resources that help people understand and enjoy color on a deeper level. One idea I’m really excited about is a contrast checker, which would allow users to test color pairings for accessibility and legibility. I’d also love to create “practical use” demos that show how a palette might look in real-world contexts—like a sample website, branding mockup, or UI component—so users can better visualize how their palettes might actually be used.

I also see a lot of potential in turning easyPalettes into a place to learn about color. I’d like to build out a set of resources that explain color theory concepts, decoding things like complementary colors, triadic schemes, color temperature, and lightness/saturation in a way that’s digestible and visually supported. I imagine an interactive color theory guide that makes it fun to explore ideas and even a searchable library of every hex code, with filters, tags, and breakdowns that help users discover new colors or understand what makes a certain shade feel bold, calm, clean, or retro.

In fact, I think every hex color deserves its own profile page—something styled like a “nutrition label” that shows RGB/HSL conversions, relative brightness, accessibility info, and maybe even popular pairings or tags based on usage. I’d also like to add optional metadata to each palette, like tags or color names, to make them searchable. With that in place, I could add a full search system where users can find palettes based on dominant hues, style tags (e.g., “earthy,” “vibrant,” “minimalist”), brightness level, or other attributes.

On the user side, I’d love to expand profiles to be more fun and interactive. There could be optional achievements or badges tied to exploration—for example, building palettes using every randomizer mode, saving your 10th palette, or receiving a certain number of likes. These kinds of features add a layer of personal engagement that turns easyPalettes from a simple tool into a more immersive experience.

There are also practical additions I’m considering, like the ability to export palettes in different formats—PNG image, CSS variables, or even JSON—to make them easier to use in design workflows. Users could eventually import palettes too, either by pasting in hex codes or uploading from other tools. Long-term, I’d love to let users create collections of palettes, remix palettes made by others, or even collaborate with friends on shared color sets.

Ultimately, I don’t want easyPalettes to be just a generator. I want it to be a creative space, a learning tool, and a design companion. It should be a place where anyone—from a brand designer to a beginner messing around with color—can find inspiration, build something meaningful, and walk away feeling more confident in their creative decisions. The project already stands on its own as a functional, polished tool—but I see a lot more possibility ahead, and I’m excited to keep building toward that vision.

---

## External Libraries and Resources
- [Bootstrap 5.3.6](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [Bootstrap Icons 1.13.1](https://icons.getbootstrap.com/)
- [Django Infinite Scroll Pagination 1.3.0](https://pypi.org/project/django-infinite-scroll-pagination/)
- [DragDropTouch 1.3.1](https://www.npmjs.com/package/drag-drop-touch)
- [Google Fonts - DM Sans](https://fonts.google.com/specimen/DM+Sans)



