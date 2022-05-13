// Projectlist data array for filling in info box
let projectListData = [];

// DOM Ready =============================================================
$(document).ready(function () {
  // Populate the project table on initial page load
  populateTable();

  // Project name link click
  $("#projectList table tbody").on(
    "click",
    "td a.linkshowproject",
    showProjectInfo
  );

  // Add Project button click
  $("#btnAddProject").on("click", addProject);

  // Edit Project link click
  $("#projectList table tbody").on(
    "click",
    "td a.linkeditproject",
    editProject
  );

  // Delete Project link click
  $("#projectList table tbody").on(
    "click",
    "td a.linkdeleteproject",
    deleteProject
  );
});

// Functions =============================================================

// Fill table with data
function populateTable() {
  // Empty content string
  let tableContent = "";

  // jQuery AJAX call for JSON
  $.getJSON("/projects/projectlist", function (data) {
    // Stick our project data array into a projectlist variable in the global object
    projectListData = data;

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function () {
      tableContent += "<tr>";
      tableContent +=
        '<td><a href="#" class="linkshowproject" rel="' +
        this.projectName +
        '" title="Show Details">' +
        this.projectName +
        "</a></td>";
      tableContent += "<td>" + this.projectDescription + "</td>";
      tableContent += "<td>" + this.projectPrice + "</td>";
      tableContent +=
        '<td><a href="/projects/edit/#{project._id}" class="linkeditproject" rel="' +
        this._id +
        '">Uredi</a></td>';
      tableContent +=
        '<td><a href="#" class="linkdeleteproject" rel="' +
        this._id +
        '">Obriši</a></td>';
      tableContent += "</tr>";
    });

    // Inject the whole content string into our existing HTML table
    $("#projectList table tbody").html(tableContent);
  });
}

// Show Project Info
function showProjectInfo(event) {
  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve project name from link rel attribute
  let relProjectName = $(this).attr("rel");

  // Get Index of object based on id value
  let arrayPosition = projectListData
    .map(function (arrayItem) {
      return arrayItem.projectName;
    })
    .indexOf(relProjectName);

  // Get our Project Object
  let projectObject = projectListData[arrayPosition];

  //Populate Info Box
  $("#projectName").text(projectObject.projectName);
  $("#projectDescription").text(projectObject.projectDescription);
  $("#projectPrice").text(projectObject.projectPrice);
  $("#projectFinishedWorks").text(projectObject.projectFinishedWorks);
  $("#projectMembers").text(projectObject.projectMembers);
  $("#projectStartDate").text(projectObject.projectStartDate);
  $("#projectEndDate").text(projectObject.projectEndDate);
}

// Add Project
function addProject(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  let errorCount = 0;
  $("#addProject input").each(function (index, val) {
    if ($(this).val() === "") {
      errorCount++;
    }
  });

  // Check and make sure errorCount's still at zero
  if (errorCount === 0) {
    // If it is, compile all project info into one object
    let newProject = {
      projectName: $("#addProject fieldset input#inputProjectName").val(),
      projectDescription: $(
        "#addProject fieldset input#inputProjectDescription"
      ).val(),
      projectPrice: $("#addProject fieldset input#inputProjectPrice").val(),
      projectFinishedWorks: $(
        "#addProject fieldset input#inputProjectFinishedWorks"
      ).val(),
      projectMembers: $("#addProject fieldset input#inputProjectMembers").val(),
      projectStartDate: $(
        "#addProject fieldset input#inputProjectStartDate"
      ).val(),
      projectEndDate: $("#addProject fieldset input#inputProjectEndDate").val(),
    };

    // Use AJAX to post the object to our addproject service
    $.ajax({
      type: "POST",
      data: newProject,
      url: "/projects/addproject",
      dataType: "JSON",
    }).done(function (response) {
      // Check for successful (blank) response
      if (response.msg === "") {
        // Clear the form inputs
        $("#addProject fieldset input").val("");

        // Update the table
        populateTable();
      } else {
        // If something goes wrong, alert the error message that our service returned
        alert("Error: " + response.msg);
      }
    });
  } else {
    // If errorCount is more than 0, error out
    alert("Please fill in all fields");
    return false;
  }
}

// Edit Project

function editProject(event) {
  event.preventDefault();
  console.log("Edit");
}

// Delete Project
function deleteProject(event) {
  event.preventDefault();

  // Pop up a confirmation dialog
  let confirmation = confirm("Are you sure you want to delete this project?");

  // Check and make sure the project confirmed
  if (confirmation === true) {
    // If they did, do our delete
    $.ajax({
      type: "DELETE",
      url: "/projects/deleteproject/" + $(this).attr("rel"),
    }).done(function (response) {
      // Check for a successful (blank) response
      if (response.msg === "") {
      } else {
        alert("Error: " + response.msg);
      }

      // Update the table
      populateTable();
    });
  } else {
    // If they said no to the confirm, do nothing
    return false;
  }
}
