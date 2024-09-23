// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    // Button Elements
    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');

    // Editable Fields Array
    let editableFields = [];
    let editorInstances = {}; // To store Editor.js instances

    // Editable IDs Array (You can add more IDs here)
    const editableServicesIds = [
        'services-1-header',
        'services-1-subheader',
        'services-1-card-title-1',
        'services-1-card-text-1',
        'services-1-card-title-2',
        'services-1-card-text-2',
        'services-1-card-title-3',
        'services-1-card-text-3',
        'services-1-card-title-4',
        'services-1-card-text-4',
        // Add other editable IDs here
    ];

    const editableResumeIds = [
        'resume-1-education-year-1',
        'resume-1-education-certification-1',
        'resume-1-education-university-1',
        'resume-1-education-grade-1',
        'resume-1-experience-year-1',
        'resume-1-experience-title-1',
        'resume-1-experience-description-1',
        'resume-1-education-year-2',
        'resume-1-education-certification-2',
        'resume-1-education-university-2',
        'resume-1-education-grade-2',
        'resume-1-experience-year-2',
        'resume-1-experience-title-2',
        'resume-1-experience-description-2',
        'resume-1-education-year-3',
        'resume-1-education-certification-3',
        'resume-1-education-university-3',
        'resume-1-education-grade-3',
        'resume-1-experience-year-3',
        'resume-1-experience-title-3',
        'resume-1-experience-description-3',
        'resume-1-education-year-4',
        'resume-1-education-certification-4',
        'resume-1-education-university-4',
        'resume-1-education-grade-4',
        'resume-1-experience-year-4',
        'resume-1-experience-title-4',
        'resume-1-experience-description-4',
    ];
    const editableStaticIds = ['static-1-experienceYears', 'static-1-experienceDescriptionLine1', 'static-1-experienceDescriptionLine2', 'static-1-completedProjectsCount', 'static-1-completedProjectsDescriptionLine1', 'static-1-completedProjectsDescriptionLine2', 'static-1-happyClientsCount', 'static-1-happyClientsDescriptionLine1', 'static-1-happyClientsDescriptionLine2', 'static-1-awardsWonCount', 'static-1-awardsWonDescriptionLine1', 'static-1-awardsWonDescriptionLine2'];

    const editableHeroIds = ['hero-1-greeting', 'hero-1-title', 'hero-1-title-highlight', 'hero-1-description', 'hero-1-download-btn', 'hero-1-hire-btn', 'hero-1-experience', 'hero-1-brand-1', 'hero-1-brand-2', 'hero-1-brand-3', 'hero-1-brand-4', 'hero-1-brand-5', 'hero-1-brand-6'];
    // Event Listeners
    editButton.addEventListener('click', () => {
        enableEditing();
        toggleButtons();
    });

    saveButton.addEventListener('click', () => {
        saveChanges();
        toggleButtons();
    });

    // Load content from Firestore when the page loads
    loadAllContentFromFirestore().then(() => {
        initializeEditorInstances();
    });

    // --------------------------------------------------------
    // Section: Firestore Integration
    // --------------------------------------------------------

    async function saveChanges() {
        try {
            const heroContent = saveHeroContent();
            const staticContent = saveStaticContent();
            const projectContent = saveProjectContent();
            const resumeContent = saveResumeContent();
            const skillsContent = saveSkillsContent();
            const serviceContent = await saveServiceContent();

            const allContent = {
                hero: heroContent,
                services: serviceContent,
                static: staticContent,
                project: projectContent,
                resume: resumeContent,
                skills: skillsContent,
            };

            await db.collection('content').doc('websiteContent').set(allContent, { merge: true });
            console.log('All changes saved to Firestore successfully!');

            editableFields = [];
            editorInstances = {};
            disableEditing();
            disableLinksAndButtons(false);
        } catch (error) {
            console.error('Error saving changes to Firestore:', error);
        }
    }

    async function loadAllContentFromFirestore() {
        try {
            const doc = await db.collection('content').doc('websiteContent').get();
            if (doc.exists) {
                const data = doc.data();
                loadHeroContent(data.hero);
                loadServiceContent(data.services);
                loadStaticContent(data.static);
                loadProjectContent(data.project);
                loadResumeContent(data.resume);
                loadSkillsContent(data.skills);
                console.log('All content loaded from Firestore successfully!');
            } else {
                console.log('No data found in Firestore. Using default values.');
            }
        } catch (error) {
            console.error('Error loading data from Firestore:', error);
        }
        disableEditing(); // Disable editing after loading
    }

    // --------------------------------------------------------
    // Section: Enable/Disable Editing
    // --------------------------------------------------------

    function enableEditing() {
        enableHeroEditing();
        enableServiceEditing();
        enableStaticEditing();
        enableProjectEditing();
        enableResumeEditing();
        enableSkillsEditing();
        // disableLinksAndButtons(true);
    }

    // function disableEditing() {
    //     editableServicesIds.forEach((id) => {
    //         const element = document.getElementById(id);
    //         if (element) {
    //             if (editorInstances[id]) {
    //                 editorInstances[id].isReady.then(() => {
    //                     editorInstances[id].readOnly.toggle(true);
    //                 });
    //             }
    //             // else {
    //             //     element.contentEditable = false;
    //             // }
    //         }
    //     });
    //     disableLinksAndButtons(false);
    // }

    function disableEditing() {
        // Disable editing for all editable fields
        [...editableServicesIds, ...editableHeroIds, ...editableResumeIds, ...editableStaticIds].forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                element.contentEditable = false; // Make sure to set contentEditable to false
                element.classList.remove('editable'); // Remove editable class
                if (editorInstances[id]) {
                    editorInstances[id].readOnly.toggle(true); // Set Editor.js instances to read-only
                }
            }
        });
        disableLinksAndButtons(false); // Re-enable links and buttons
    }

    // --------------------------------------------------------
    // Section: Save Content Functions
    // --------------------------------------------------------

    function saveHeroContent() {
        const heroContent = {};
        editableHeroIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                heroContent[id] = element.innerText;
            }
        });
        return heroContent;
    }

    // Updated saveServiceContent function to save JSON content for Editor.js instances
    async function saveServiceContent() {
        const serviceContent = {};
        for (const id of editableServicesIds) {
            const element = document.getElementById(id);
            if (element) {
                if (editorInstances[id]) {
                    try {
                        const outputData = await editorInstances[id].save();
                        serviceContent[id] = JSON.stringify(outputData);
                    } catch (error) {
                        console.error(`Error saving content for ${id}:`, error);
                        serviceContent[id] = element.innerHTML; // Fallback to innerHTML if saving fails
                    }
                } else {
                    serviceContent[id] = element.innerText;
                }
            }
        }
        return serviceContent;
    }
    function initializeEditorInstances() {
        editableServicesIds.forEach((id) => {
            if (id.includes('card-text')) {
                const element = document.getElementById(id);
                if (element && !editorInstances[id]) {
                    const existingContent = element.innerHTML;
                    const initialData = {
                        blocks: [
                            {
                                type: 'paragraph',
                                data: {
                                    text: existingContent,
                                },
                            },
                        ],
                    };
                    editorInstances[id] = new EditorJS({
                        holder: id,
                        tools: {
                            header: Header,
                            paragraph: Paragraph,
                            list: List,
                        },
                        data: initialData,
                        readOnly: true,
                    });
                }
            }
        });
    }

    function saveStaticContent() {
        const staticContent = {};
        editableStaticIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                staticContent[id] = element.textContent;
            }
        });
        return staticContent;
    }

    function saveProjectContent() {
        const projectContent = {};
        editableHeroIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                projectContent[id] = element.textContent;
            }
        });
        return projectContent;
    }

    function saveResumeContent() {
        const resumeContent = {};
        editableResumeIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                resumeContent[id] = element.textContent;
            }
        });
        return resumeContent;
    }

    function saveSkillsContent() {
        const skillsContent = {};
        const skills = document.querySelectorAll('.skills');
        skills.forEach((skill, index) => {
            const icon = skill.querySelector('.skills-icon img');
            const ratio = skill.querySelector('.skills-ratio h3');
            const label = skill.querySelector('.skills-ratio p');
            skillsContent[`skill-${index + 1}-icon`] = icon.src;
            skillsContent[`skill-${index + 1}-ratio`] = ratio.textContent;
            skillsContent[`skill-${index + 1}-label`] = label.textContent;
        });
        return skillsContent;
    }

    // --------------------------------------------------------
    // Section: Load Content Functions
    // --------------------------------------------------------

    function loadHeroContent(heroData) {
        Object.entries(heroData).forEach(([id, content]) => {
            const element = document.getElementById(id);
            if (element) {
                element.innerText = content;
            }
        });
    }

    // function loadServiceContent(servicesData) {
    //     Object.entries(servicesData).forEach(([id, content]) => {
    //         const element = document.getElementById(id);
    //         if (element) {
    //             if (editorInstances[id]) {
    //                 editorInstances[id].isReady.then(() => {
    //                     editorInstances[id].render(JSON.parse(content));
    //                 });
    //             } else {
    //                 element.innerText = content;
    //             }
    //         }
    //     });
    // }

    // Updated loadServiceContent function to correctly render JSON content as HTML
    function loadServiceContent(servicesData) {
        Object.entries(servicesData).forEach(([id, content]) => {
            const element = document.getElementById(id);
            if (element) {
                if (id.includes('card-text')) {
                    try {
                        const parsedContent = JSON.parse(content);
                        if (!editorInstances[id]) {
                            editorInstances[id] = new EditorJS({
                                holder: id,
                                tools: {
                                    header: Header,
                                    paragraph: Paragraph,
                                    list: List,
                                },
                                data: parsedContent,
                                readOnly: false,
                            });
                        } else {
                            editorInstances[id].render(parsedContent);
                        }
                    } catch (error) {
                        console.error(`Error parsing content for ${id}:`, error);
                        element.innerHTML = content; // Fallback to plain text if parsing fails
                    }
                } else {
                    element.innerText = content;
                }
            }
        });
    }
    function loadStaticContent(staticData) {
        Object.entries(staticData).forEach(([id, content]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = content;
            }
        });
    }

    function loadProjectContent(projectData) {
        Object.entries(projectData).forEach(([id, content]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = content;
            }
        });
    }

    function loadResumeContent(resumeData) {
        Object.entries(resumeData).forEach(([id, content]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = content;
            }
        });
    }

    function loadSkillsContent(skillsData) {
        Object.entries(skillsData).forEach(([key, value]) => {
            const [type, index, property] = key.split('-');
            const skill = document.querySelectorAll('.skills')[index - 1];
            if (skill) {
                if (property === 'icon') {
                    const icon = skill.querySelector('.skills-icon img');
                    if (icon) icon.src = value;
                } else if (property === 'ratio') {
                    const ratio = skill.querySelector('.skills-ratio h3');
                    if (ratio) ratio.textContent = value;
                } else if (property === 'label') {
                    const label = skill.querySelector('.skills-ratio p');
                    if (label) label.textContent = value;
                }
            }
        });
    }

    // --------------------------------------------------------
    // Section: Enable Editing Functions
    // --------------------------------------------------------

    function enableHeroEditing() {
        editableHeroIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                element.contentEditable = true;
                element.classList.add('editable');
            }
        });
    }

    function enableServiceEditing() {
        editableServicesIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element && id.includes('card-text')) {
                if (!editorInstances[id]) {
                    const existingContent = element.innerHTML;
                    const initialData = {
                        blocks: [
                            {
                                type: 'paragraph',
                                data: {
                                    text: existingContent,
                                },
                            },
                        ],
                    };
                    editorInstances[id] = new EditorJS({
                        holder: id,
                        tools: {
                            header: Header,
                            paragraph: Paragraph,
                            list: List,
                        },
                        data: initialData,
                        readOnly: false,
                    });
                } else {
                    editorInstances[id].readOnly.toggle(false);
                }
            } else if (element) {
                element.contentEditable = true;
                element.classList.add('editable');
            }
        });
    }
    function enableStaticEditing() {
        editableStaticIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                element.contentEditable = true;
                element.classList.add('editable');
            }
        });
    }

    function enableProjectEditing() {
        editableHeroIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                element.contentEditable = true;
                element.classList.add('editable');
            }
        });
    }

    function enableResumeEditing() {
        editableResumeIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                element.contentEditable = true;
                element.classList.add('editable');
            }
        });
    }

    function enableSkillsEditing() {
        const skills = document.querySelectorAll('.skills');
        skills.forEach((skill) => {
            const ratio = skill.querySelector('.skills-ratio h3');
            const label = skill.querySelector('.skills-ratio p');
            if (ratio) {
                ratio.contentEditable = true;
                ratio.classList.add('editable');
            }
            if (label) {
                label.contentEditable = true;
                label.classList.add('editable');
            }
        });
    }

    // --------------------------------------------------------
    // Section: Render HTML Content from Editor.js Data
    // --------------------------------------------------------
    function renderEditorJsContent(data) {
        const wrapper = document.createElement('div'); // Create a container for the HTML content

        data.blocks.forEach((block) => {
            let htmlElement;

            switch (block.type) {
                case 'header':
                    htmlElement = document.createElement(`h${block.data.level}`);
                    htmlElement.innerText = block.data.text;
                    break;

                case 'paragraph':
                    htmlElement = document.createElement('p');
                    htmlElement.innerHTML = block.data.text;
                    break;

                case 'list':
                    if (block.data.style === 'unordered') {
                        htmlElement = document.createElement('ul');
                    } else {
                        htmlElement = document.createElement('ol');
                    }
                    block.data.items.forEach((item) => {
                        const li = document.createElement('li');
                        li.innerHTML = item;
                        htmlElement.appendChild(li);
                    });
                    break;

                case 'quote':
                    htmlElement = document.createElement('blockquote');
                    htmlElement.innerHTML = `<p>${block.data.text}</p><cite>${block.data.caption}</cite>`;
                    break;

                case 'image':
                    htmlElement = document.createElement('div');
                    htmlElement.classList.add('image-block');
                    const img = document.createElement('img');
                    img.src = block.data.file.url;
                    img.alt = block.data.caption || 'Image';
                    htmlElement.appendChild(img);

                    if (block.data.caption) {
                        const caption = document.createElement('figcaption');
                        caption.innerText = block.data.caption;
                        htmlElement.appendChild(caption);
                    }
                    break;

                case 'embed':
                    htmlElement = document.createElement('div');
                    htmlElement.classList.add('embed-block');
                    const iframe = document.createElement('iframe');
                    iframe.src = block.data.embed;
                    iframe.width = block.data.width;
                    iframe.height = block.data.height;
                    iframe.frameBorder = 0;
                    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
                    iframe.allowFullscreen = true;
                    htmlElement.appendChild(iframe);

                    if (block.data.caption) {
                        const caption = document.createElement('p');
                        caption.classList.add('embed-caption');
                        caption.innerText = block.data.caption;
                        htmlElement.appendChild(caption);
                    }
                    break;

                default:
                    console.warn(`Unknown block type: ${block.type}`);
                    break;
            }

            if (htmlElement) {
                wrapper.appendChild(htmlElement);
            }
        });

        return wrapper.innerHTML; // Return the generated HTML as a string
    }

    // --------------------------------------------------------
    // Section: Utility Functions
    // --------------------------------------------------------

    function toggleButtons() {
        editButton.classList.toggle('d-none');
        saveButton.classList.toggle('d-none');
    }

    function disableLinksAndButtons(disable) {
        const linksAndButtons = document.querySelectorAll('a:not([data-bs-target=".offCanvas__info"]), button:not(#saveButton):not([data-bs-target=".offCanvas__info"])');
        linksAndButtons.forEach((item) => {
            item.disabled = disable;
            item.classList.toggle('disabled', disable);
            item.style.pointerEvents = disable ? 'none' : 'auto';
            item.style.opacity = disable ? '0.5' : '1';
        });
    }
});
