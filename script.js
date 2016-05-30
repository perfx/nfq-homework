window.onload = function () {
    'use strict';
    
    var firstTime = true;
    
    var users  = [];
    var groups = [];
    
    var createGroupButtons = document.querySelectorAll('[data-js-name="create-group"]'),
        createUserButtons  = document.querySelectorAll('[data-js-name="create-user"]');
    
    var splashScreenContainer = document.querySelector('[data-js-name="splash-screen"]');
        
    var createContainer = document.querySelector('[data-js-name="create-container"]');
    var createGroupContainer = document.querySelector('[data-js-name="create-group-container"]');
    var createUserContainer  = document.querySelector('[data-js-name="create-user-container"]');
    
    var createGroupSearch = document.querySelector('[data-js-name="create-group-search"]');
    
    var submitGroupButton = document.querySelector('[data-js-name="submit-group"]');
    var submitUserButton  = document.querySelector('[data-js-name="submit-user"]');    
    
    var groupListButton = document.querySelector('[data-js-name="group-list-button"]');
    var userListButton = document.querySelector('[data-js-name="user-list-button"]');
    
    var groupListContainer = document.querySelector('[data-js-name="group-list"]');
    var userListContainer  = document.querySelector('[data-js-name="user-list"]');
    
    var groupDetailsContainer = document.querySelector('[data-js-name="group-details"]');
    var userDetailsContainer  = document.querySelector('[data-js-name="user-details"]');
    
    var groupDetailsName = document.querySelector('[data-js-name="group-details-name"]'),
        groupDetailsDesc = document.querySelector('[data-js-name="group-details-desc"]'),
        groupDetailsMemberList = document.querySelector('[data-js-name="group-details-member-list"]'),
        groupDetailsBackButton = document.querySelector('[data-js-name="group-details-back-button"]'),
        userDetailsName  = document.querySelector('[data-js-name="user-details-name"]'),
        userDetailsDesc  = document.querySelector('[data-js-name="user-details-description"]'),
        userDetailsBackButton = document.querySelector('[data-js-name="user-details-back-button"]');
    
    var userSearch = document.querySelector('[data-js-name="user-search"]');
    var userSearchResults = document.querySelector('[data-js-name="search-results"]');
    
    var generateID = (length) => {
        let temp = "";
        let source = "QWERTYUIOPASDFGHJKLZXCVBNM";
        
        for (let i = 0; i < length; i++) {
            temp += source[Math.floor(Math.random() * source.length)];
        }
        
        return temp;
    }
    
    var showGroupList = () => {
        if (groupListContainer.classList.contains("hidden")) {
            let content = document.querySelector('[data-js-name="content"]');
            
            for (let child of content.children) {
                if (!child.classList.contains("hidden")) {
                    child.classList.toggle("hidden");
                }
            }

            groupListContainer.classList.toggle("hidden");
        }
    };
    
    var showUserList = () => {
        if (userListContainer.classList.contains("hidden")) {
            let content = document.querySelector('[data-js-name="content"]');
            
            for (let child of content.children) {
                if (!child.classList.contains("hidden")) {
                    child.classList.toggle("hidden");
                }
            }
            
            userListContainer.classList.toggle("hidden");
        }
    };
    
    var showMember = (groupReference, userReference) => {
        let user = document.createElement("div");
        let deleteUser = document.createElement("input");
        user.classList.add("details__user");
        
        let userText = document.createElement("div");
        userText.classList.add("details__user-text");
        userText.innerHTML = userReference.name;
        user.appendChild(userText);
                                    
        deleteUser.classList.add("medium-button");
        deleteUser.classList.add("medium-button--blue");
        deleteUser.classList.add("medium-button--delete-user");
        deleteUser.type = "button";
        deleteUser.value = "Delete";
                
        deleteUser.addEventListener("click", () => {
            groupReference.members.splice(groupReference.members.indexOf(userReference.id), 1);
            user.remove();
        });
                
        user.appendChild(deleteUser);
        groupDetailsMemberList.appendChild(user);        
    }
    
    var createGroupHTML = (groupReference) => {
        let groupThumb = document.createElement("div");
        
        let groupDetailsButton = document.createElement("input");
        let groupDeleteButton = document.createElement("input");
        
        groupDetailsButton.classList.add("medium-button");
        groupDetailsButton.classList.add("medium-button--green");
        groupDetailsButton.classList.add("medium-button--thumb");
        groupDetailsButton.classList.add("smooth-transition");
        groupDetailsButton.setAttribute("type", "button");
        groupDetailsButton.setAttribute("value", "Details");
        
        groupDeleteButton.classList.add("medium-button");
        groupDeleteButton.classList.add("medium-button--thumb");
        groupDeleteButton.setAttribute("type", "button");
        groupDeleteButton.setAttribute("value", "Delete");
        
        let memberCount = document.createElement("div");
        memberCount.classList.add("box-text");
        memberCount.classList.add("box-text--thumb");
        groupThumb.classList.add("thumb")
        groupThumb.classList.add("thumb--group");
        groupThumb.innerHTML = "<h3>" + groupReference.name + "</h3>";
       
        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("thumb__button-container");
        
        buttonContainer.appendChild(groupDetailsButton);
        buttonContainer.appendChild(groupDeleteButton);
        
        groupThumb.appendChild(buttonContainer);
        
        groupDetailsButton.addEventListener("click", () => {    
            groupDetailsName.innerHTML = "<h3>" + groupReference.name + "</h3>";
            groupDetailsDesc.innerHTML = (groupReference.description == "" ? "No description." : groupReference.description);
            
            groupDetailsMemberList.innerHTML = "";
            userSearchResults.innerHTML = "";
            
            if (groupReference.members.length == 0) groupDetailsMemberList.innerHTML = "";
            for (let i = 0; i < groupReference.members.length; i++) {
                showMember(groupReference, users.find(x => x.id == groupReference.members[i]));
            }
            
            groupListContainer.classList.toggle("hidden");
            groupDetailsContainer.classList.toggle("hidden");
            
            userSearch.setAttribute("data-js-reference", groupReference.id);
            userSearch.value = "";
        });
        
        groupDeleteButton.addEventListener("click", function () {
            if (groupReference.members.length == 0) {
                groups.splice(groups.indexOf(groupReference, 1));
                this.parentElement.remove(); 
            }
        });
        
        groupListContainer.insertBefore(groupThumb, groupListContainer.firstChild);
    }
    
    var createUserHTML = (userReference) => {
        let userThumb = document.createElement("div");
        let userDetailsButton = document.createElement("input");
        let userDeleteButton = document.createElement("input");
        
        userDetailsButton.classList.add("medium-button");
        userDetailsButton.classList.add("medium-button--blue");
        userDetailsButton.classList.add("medium-button--thumb");
        userDetailsButton.classList.add("smooth-transition");
        userDetailsButton.setAttribute("type", "button");
        userDetailsButton.setAttribute("value", "Details");
        
        userDeleteButton.classList.add("medium-button");
        userDeleteButton.classList.add("medium-button--thumb");
        userDeleteButton.setAttribute("type", "button");
        userDeleteButton.setAttribute("value", "Delete");
        
        userThumb.classList.add("thumb")
        userThumb.classList.add("thumb--user");
        userThumb.innerHTML = "<h3>" + userReference.name + "</h3>";
  
        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("thumb__button-container");
        
        buttonContainer.appendChild(userDetailsButton);
        buttonContainer.appendChild(userDeleteButton);
        
        userThumb.appendChild(buttonContainer);
        
        userDetailsButton.addEventListener("click", () => {
            userDetailsName.innerHTML = "<h3>" + userReference.name + "</h3>";
            userListContainer.classList.toggle("hidden");
            userDetailsContainer.classList.toggle("hidden");
            
            let userGroups = [];

            for (let group of groups) {
                if (group.members.indexOf(userReference.id) != -1) {
                    userGroups.push(group.name);
                }
            }
            
            if (userGroups.length > 0) {
                userDetailsDesc.innerHTML = "User is a member of: ";
                
                for (let i = 0; i < userGroups.length; i++) {
                    userDetailsDesc.innerHTML += userGroups[i];
                    userDetailsDesc.innerHTML += (i + 1) == userGroups.length ? "" : ", ";
                }
            } else {
                userDetailsDesc.innerHTML = "This user isn't a member of any groups.";
            }
        });
        
        userDeleteButton.addEventListener("click", function () {
            for (let i = 0; i < groups.length; i++) {
                groups[i].members.splice(groups[i].members.indexOf(id), 1);
            }
            
            users.splice(users.indexOf(userReference, 1));
            this.parentElement.remove();
        });
        
        userListContainer.insertBefore(userThumb, userListContainer.firstChild);
    };
    
    var showCreateGroup = () => {
        if (firstTime) { 
            splashScreenContainer.classList.toggle("hidden");
            
            createContainer.classList.toggle("hidden");
            createGroupContainer.classList.toggle("hidden");
        } else { 
            if (createContainer.classList.contains("hidden")) {
                let content = document.querySelector('[data-js-name="content"]');
            
                for (let child of content.children) {
                    if (!child.classList.contains("hidden")) {
                        child.classList.toggle("hidden");
                    }
                }

                createContainer.classList.toggle("hidden");
                createGroupContainer.classList.toggle("hidden");
            }
        } 
    }
    
    var showCreateUser = () => {
         if (firstTime) { 
            splashScreenContainer.classList.toggle("hidden");
            
            createContainer.classList.toggle("hidden");
            createUserContainer.classList.toggle("hidden");
        } else { 
            if (createContainer.classList.contains("hidden")) {
                let content = document.querySelector('[data-js-name="content"]');
            
                for (let child of content.children) {
                    if (!child.classList.contains("hidden")) {
                        child.classList.toggle("hidden"); 
                    }
                }

                createContainer.classList.toggle("hidden");
                createUserContainer.classList.toggle("hidden");
            }
        } 
    }
    
    for (let i = 0; i < createGroupButtons.length; i++) {
        createGroupButtons[i].addEventListener("click", showCreateGroup);
    }

    for (let i = 0; i < createUserButtons.length; i++) {
        createUserButtons[i].addEventListener("click", showCreateUser);
    }
    
    submitGroupButton.addEventListener("click", function () {
        let groupNameInput = this.parentElement["group-name"];
        let groupDescInput = this.parentElement["group-desc"];
        
        if (groupNameInput.value !== null && groupNameInput.value !== "") {
            let groupID = generateID(8);
            
            let groupObject = { 
                name : groupNameInput.value,
                description: groupDescInput.value,
                members: [],
                id: groupID
            };
            
            groups.push(groupObject);
            createGroupHTML(groupObject);
            
            createGroupContainer.classList.toggle("hidden");
            createContainer.classList.toggle("hidden");
            this.parentElement.reset();
            
            if (firstTime) {
                groupListButton.addEventListener("click", showGroupList);
                userListButton.addEventListener("click", showUserList);
                
                firstTime = false;
            }
            
            groupListContainer.classList.toggle("hidden");
            if (groupNameInput.classList.contains("create__input--invalid")) {
                groupNameInput.classList.remove("create__input--invalid");
            }
        } else {
            groupNameInput.classList.add("create__input--invalid");
        }
    });
    
    submitUserButton.addEventListener("click", function () {
        let userNameInput    = this.parentElement["user-name"];
        let userSurnameInput = this.parentElement["user-surname"];
        
        if (userNameInput.value !== null && userNameInput.value !== "") {            
            let userID = generateID(8);
            
            let userObject = {
                name : userNameInput.value + " " + userSurnameInput.value,
                id : userID
            };
            
            users.push(userObject);
            createUserHTML(userObject);
            
            createUserContainer.classList.toggle("hidden");
            createContainer.classList.toggle("hidden");
            this.parentElement.reset();
            
            if (firstTime) {
                groupListButton.addEventListener("click", showGroupList);
                userListButton.addEventListener("click", showUserList);
                
                firstTime = false;
            }
            
            userListContainer.classList.toggle("hidden");
            if (userNameInput.classList.contains("create__input--invalid")) {
                userNameInput.classList.remove("create__input--invalid");
            }
        } else {
            userNameInput.classList.add("create__input--invalid");
        }
    });
    
    groupDetailsBackButton.addEventListener("click", showGroupList);
    userDetailsBackButton.addEventListener("click", showUserList);
    
    userSearch.addEventListener("keyup", function () {
        let searchQuery = userSearch.value.trim().toLowerCase();
        userSearchResults.innerHTML = "";
        
        if (searchQuery !== null && searchQuery !== "") {
            let searchResults = users.filter(x => x.name.toLowerCase().contains(searchQuery));
            
            for (let i = 0; i < searchResults.length; i++) {
                let groupReference = groups.find(x => x.id == userSearch.getAttribute("data-js-reference"));
                if (groupReference.members.indexOf(searchResults[i].id) >= 0) continue;
                                
                let result = document.createElement("li");
                result.classList.add("search-results__result");
                result.innerHTML = searchResults[i].name;

                result.addEventListener("click", function () {
                    groupReference.members.push(searchResults[i].id);
                    result.remove();    
                    showMember(groupReference, searchResults[i])
                });
                
                userSearchResults.appendChild(result);
            }
        }
    });
};