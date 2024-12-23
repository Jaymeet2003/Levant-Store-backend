// Login
document.getElementById('login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            window.location.href = '/admin/dashboard';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


// Register
document.getElementById('register-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }

    try {
        const response = await fetch('/admin/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Admin registered successfully!');
            window.location.href = '/admin';
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (err) {
        console.error('Error:', err);
    }
});

// blogForm
document.getElementById('logout-btn')?.addEventListener('click', async () => {
    try {
        const response = await fetch('/admin/logout', { method: 'POST' });
        if (response.ok) {
            alert('Logged out successfully.');
            window.location.href = '/admin';
        } else {
            alert('Error logging out.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


// Create blog button
document.getElementById('create-blog-btn')?.addEventListener('click', async () => {
    try {
        const response = await fetch('/admin/blogForm');
        if (response.ok) {
            window.location.href = '/admin/blogForm';
        } else if (response.status === 401) {
            alert('Your session has expired. Please log in again.');
            window.location.href = '/admin';
        } else {
            alert('You are not authorized to access this page. Please log in.');
            window.location.href = '/admin';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while trying to access the blog form.');
    }
});


// // Create Blog
// document.getElementById('create-blog-form')?.addEventListener('submit', async (event) => {
//     event.preventDefault();
//     const title = document.getElementById('blog-title').value;
//     const content = document.getElementById('blog-content').value;

//     const response = await fetch('/blog/create', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ title, content })
//     });

//     const data = await response.json();
//     if (response.ok) {
//         alert('Blog created successfully!');
//     } else {
//         alert(`Error: ${data.message}`);
//     }
// });

document.getElementById('create-blog-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(); // Create FormData object to handle file uploads
    formData.append('title', document.getElementById('blog-title').value);
    formData.append('content', document.getElementById('blog-content').value);
    formData.append('image', document.getElementById('blog-image').files[0]); // Add the file input
    formData.append('seoKeywords', document.getElementById('blog-keywords').value);


    try {
        const response = await fetch('/blog/create', {
            method: 'POST',
            body: formData // Send form data including the file
        });

        const data = await response.json();
        if (response.ok) {
            alert('Blog created successfully!');
            console.log('SEO Keywords:', data.seoKeywords); // Log SEO keywords for debugging
            window.location.href = '/admin/dashboard';
        } else if (response.status === 401) {
            alert('Your session has expired. Please log in again.');
            window.location.href = '/admin';
        } else{
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the blog.');
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const blogContainer = document.querySelector('.blog-cards-container');

    try {
        const response = await fetch('/blogs');
        if (!response.ok) {
            throw new Error('Failed to fetch blogs');
        }

        const blogs = await response.json();

        // Clear the container
        blogContainer.innerHTML = '';

        // Create cards for each blog
        blogs.forEach(blog => {
            const card = document.createElement('div');
            card.className = 'blog-card';

            const image = document.createElement('img');
            image.src = blog.image ? `/uploads/${blog.image}` : '/img/img.png';
            image.alt = blog.title || 'Default Image';

            const title = document.createElement('h3');
            title.className = 'card-title';
            title.textContent = blog.title;

            const editButton = document.createElement('button');
            editButton.className = 'edit-btn';
            editButton.textContent = 'Edit Blog';
            editButton.addEventListener('click', () => handleEdit(blog)); // Attach click handler

            card.appendChild(image);
            card.appendChild(title);
            card.appendChild(editButton); // Add the Edit button
            blogContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        blogContainer.innerHTML = '<p>Error loading blogs.</p>';
    }
});

// Function to handle editing
function handleEdit(blog) {
    // Redirect to the edit form or open a modal for editing
    window.location.href = `/admin/edit-blog/${blog._id}`; // Replace with your edit blog URL or open modal
}

