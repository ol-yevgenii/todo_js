window.addEventListener("DOMContentLoaded", () => {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoForm = document.querySelector('.todo_form');

    // Get userName from HTML and put to localStorage
    const nameInput = document.querySelector('#greatings');
    const username = localStorage.getItem('username') || "";
    nameInput.value = username;

    nameInput.addEventListener('change', e => {
        localStorage.setItem('username', e.target.value);
    })

    // Clock

    const clock = () => {
        const clockHours = document.querySelector('.header_clock-hours');
        const clockMinuts = document.querySelector('.header_clock-minutes');

        const date = new Date();
        const hours = date.getHours();
        const minuts = date.getMinutes();

        if (hours < 10) {
            clockHours.innerHTML = "0" + hours;
        } else {
            clockHours.innerHTML = hours;
        }

        if (minuts < 10) {
            clockMinuts.innerHTML = "0" + minuts;
        } else {
            clockMinuts.innerHTML = minuts;
        }
    }

    setTimeout(clock, 1000);

    // Weather and Location

    getForecast();

    // Create, render task and add to localStorage
    todoForm.addEventListener('submit', e => {
        e.preventDefault();

        const content = e.target.elements.content.value;
        const category = e.target.elements.category.value;

        const todo = {
            content: content,
            category: category,
            done: false,
            id: new Date().getTime()
        }

        // Check for availability tasks in list

        const taskAvailability = () => {
            let isHasTask = false;
            todos.forEach(todo => {
                if (todo.content == content) {
                    isHasTask = true;
                }
            })
            return isHasTask;
        }

        if ((todo.content && todo.category) == "") {
            alert("Your task is empty or your did not pick a category");
        } else if (taskAvailability()) {
            alert("Already have this task");
        } else {
            todos.push(todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            e.target.reset();

            renderTodo();
        }
    })

    // Render task from localStorage after re-load page

    renderTodo();

})

const select = document.querySelector('.select_tasks');
const allTasks = document.querySelector('.all_tasks');

// Receive your current position

const getForecast = () => {

    const location = document.querySelector('.header_weather-location');
    const weather = document.querySelector('.header_weather-degrees');
    
    const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Weather API url
        const weatherApiUrl = `http://api.weatherapi.com/v1/current.json?key=25fb10b92c0c480fa26183729221110&q=${latitude},${longitude}&aqi=no`

        fetch(weatherApiUrl)
        .then(res => res.json())
        .then(data => {
            location.textContent = data.location.name + ',';
            weather.textContent = Math.floor(data.current.temp_c) + ' °C';
        })
    }

    const error = () => {
        location.textContent = 'Location';
        weather.textContent = 'Weather';
    }

    navigator.geolocation.getCurrentPosition(success, error);
}

const renderTodo = () => {

    allTasks.innerHTML = '';

    todos.forEach(todo => {

        // Create task element

        const todoItem = document.createElement('div');
        const categoryLabel = document.createElement('label');
        const checkbox = document.createElement('input');
        const checkboxDecor = document.createElement('span');
        const todoContent = document.createElement('div');
        const todoAction = document.createElement('div');
        const editButton = document.createElement('button');
        const delButton = document.createElement('button');

        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;

        // Change task style depend on condition 

        if (todo.done) {
            todoItem.classList.add('done');
            todoContent.innerHTML = 
            `<input
                class="todo_done"
                id="todo_content"
                type="text"
                value="${todo.content}"
                readonly
            >
            `
        } else {
            todoItem.classList.remove('done');
            todoContent.innerHTML = 
            `<input
                id="todo_content"
                type="text"
                value="${todo.content}"
                readonly
            >
            `
        }

        //  Edit button icon

        editButton.innerHTML = 
        `
            <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 256 256" id="Flat">
                <path class="svg_path" d="M226.82813,61.17163l-32-31.99976a3.99854,3.99854,0,0,0-5.65625,0l-96,95.99976A4.00065,4.00065,0,0,0,92,128v32a4.0002,4.0002,0,0,0,4,4h32a4,4,0,0,0,2.82813-1.17139l96-96.00024A3.99913,3.99913,0,0,0,226.82813,61.17163ZM126.34277,156H100V129.65674l68.00012-68,26.343,26.34277Zm73.65686-73.65674L173.65662,56,192,37.65674,218.34277,64ZM220,120v88a12.01343,12.01343,0,0,1-12,12H48a12.01343,12.01343,0,0,1-12-12V48A12.01343,12.01343,0,0,1,48,36h88a4,4,0,0,1,0,8H48a4.00427,4.00427,0,0,0-4,4V208a4.00427,4.00427,0,0,0,4,4H208a4.00427,4.00427,0,0,0,4-4V120a4,4,0,0,1,8,0Z"/>
            </svg>
        `

        // Delete button icon

        delButton.innerHTML = 
        `
            <svg class="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="25px" height="25px" viewBox="0 0 729.837 729.838" style="enable-background:new 0 0 729.837 729.838;" xml:space="preserve">
            <g>
                <g>
                    <g>
                        <path class="svg_path" d="M589.193,222.04c0-6.296,5.106-11.404,11.402-11.404S612,215.767,612,222.04v437.476c0,19.314-7.936,36.896-20.67,49.653     c-12.733,12.734-30.339,20.669-49.653,20.669H188.162c-19.315,0-36.943-7.935-49.654-20.669     c-12.734-12.734-20.669-30.313-20.669-49.653V222.04c0-6.296,5.108-11.404,11.403-11.404c6.296,0,11.404,5.131,11.404,11.404     v437.476c0,13.02,5.37,24.922,13.97,33.521c8.6,8.601,20.503,13.993,33.522,13.993h353.517c13.019,0,24.896-5.394,33.498-13.993     c8.624-8.624,13.992-20.503,13.992-33.498V222.04H589.193z"/>
                        <path d="M279.866,630.056c0,6.296-5.108,11.403-11.404,11.403s-11.404-5.107-11.404-11.403v-405.07     c0-6.296,5.108-11.404,11.404-11.404s11.404,5.108,11.404,11.404V630.056z"/>
                        <path d="M376.323,630.056c0,6.296-5.107,11.403-11.403,11.403s-11.404-5.107-11.404-11.403v-405.07     c0-6.296,5.108-11.404,11.404-11.404s11.403,5.108,11.403,11.404V630.056z"/>
                        <path d="M472.803,630.056c0,6.296-5.106,11.403-11.402,11.403c-6.297,0-11.404-5.107-11.404-11.403v-405.07     c0-6.296,5.107-11.404,11.404-11.404c6.296,0,11.402,5.108,11.402,11.404V630.056L472.803,630.056z"/>
                        <path d="M273.214,70.323c0,6.296-5.108,11.404-11.404,11.404c-6.295,0-11.403-5.108-11.403-11.404     c0-19.363,7.911-36.943,20.646-49.677C283.787,7.911,301.368,0,320.73,0h88.379c19.339,0,36.92,7.935,49.652,20.669     c12.734,12.734,20.67,30.362,20.67,49.654c0,6.296-5.107,11.404-11.403,11.404s-11.403-5.108-11.403-11.404     c0-13.019-5.369-24.922-13.97-33.522c-8.602-8.601-20.503-13.994-33.522-13.994h-88.378c-13.043,0-24.922,5.369-33.546,13.97     C278.583,45.401,273.214,57.28,273.214,70.323z"/>
                        <path d="M99.782,103.108h530.273c11.189,0,21.405,4.585,28.818,11.998l0.047,0.048c7.413,7.412,11.998,17.628,11.998,28.818     v29.46c0,6.295-5.108,11.403-11.404,11.403h-0.309H70.323c-6.296,0-11.404-5.108-11.404-11.403v-0.285v-29.175     c0-11.166,4.585-21.406,11.998-28.818l0.048-0.048C78.377,107.694,88.616,103.108,99.782,103.108L99.782,103.108z      M630.056,125.916H99.782c-4.965,0-9.503,2.02-12.734,5.274L87,131.238c-3.255,3.23-5.274,7.745-5.274,12.734v18.056h566.361     v-18.056c0-4.965-2.02-9.503-5.273-12.734l-0.049-0.048C639.536,127.936,635.021,125.916,630.056,125.916z"/>
                    </g>
                </g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            </svg>
        `

        // Category styles

        if (todo.category == 'business') {
            checkboxDecor.classList.add('business_bubble');
        } else {
            checkboxDecor.classList.add('personal_bubble');
        }

        // Add style classes to task element
    
        todoItem.classList.add('todo');
        categoryLabel.classList.add('category');
        todoContent.classList.add('todo_content');
        todoAction.classList.add('todo_action');
        editButton.classList.add('edit');
        delButton.classList.add('delete');

        allTasks.appendChild(todoItem);
        todoItem.appendChild(categoryLabel);
        categoryLabel.appendChild(checkbox);
        categoryLabel.appendChild(checkboxDecor);
        todoItem.appendChild(todoContent);
        todoItem.appendChild(todoAction);
        todoAction.appendChild(editButton);
        todoAction.appendChild(delButton);

        // Chenge task condition and save to localStorage

        checkbox.addEventListener('click', e => {
            todo.done = e.target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));

            renderTodo();
        })

        // Edit task valume and save to localStorage

        editButton.addEventListener('click', e => {
            let editContent = todoContent.querySelector('input');
            editContent.removeAttribute('readonly');
            editContent.focus();
            editContent.addEventListener('blur', e => {
                editContent.setAttribute('readonly', true);
                todo.content = e.target.value;
                localStorage.setItem('todos', JSON.stringify(todos));
                renderTodo();
            })
        })


        // Delete task from page and localStorage

        delButton.addEventListener('click', e => {
            e.preventDefault();

            todos = todos.filter(t => t !== todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodo();
        })
        
    })
}

// Condition tasks selector

const todoFilter = (e) => {
    const todos = allTasks.childNodes;
    todos.forEach(todo => {
        switch (e.target.value) {
            case "1":
                todo.style.display = 'flex';
                break;
            case "2":
                if (!todo.classList.contains('done')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
            case "3":
                if (todo.classList.contains('done')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
        }
    })

}

select.addEventListener('change', todoFilter);
