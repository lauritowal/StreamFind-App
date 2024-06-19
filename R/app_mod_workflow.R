#' @title .mod_workflow_UI
#' 
#' @description Shiny module UI for workflow tab.
#' 
#' @noRd
#' 
.mod_workflow_UI <- function(id) {
  ns <- shiny::NS(id)
  htmltools::tagList(
    shiny::column(6, shiny::uiOutput(ns("workflow_settings"))),
    shiny::column(6, 
      shiny::selectInput(ns("workflow_settings_select"), "Select Processing Settings", choices = c("a", "b"), multiple = FALSE),
      shiny::uiOutput(ns("selected_function_details"))
    )
  )
}

#' @title .mod_workflow_Server
#' 
#' @description Shiny module server for workflow tab.
#' 
#' @noRd
#'
.mod_workflow_Server <- function(id, engine, reactive_workflow) {
  shiny::moduleServer(id, function(input, output, session) {
    ns <- session$ns

    available_processing_methods <- engine$processing_methods()$name
    StreamFind_env <- as.environment("package:StreamFind")
    Settings_functions <- ls(envir = StreamFind_env, pattern = "^Settings_")
    Settings_functions <- Settings_functions[sapply(Settings_functions, function(x) is.function(get(x, envir = .GlobalEnv)))]
    Settings_functions <- Settings_functions[sapply(Settings_functions, function(x) any(sapply(available_processing_methods, function(y) grepl(y, x, ))))]
    Settings_functions_short <- gsub("Settings_", "", Settings_functions)
    names(Settings_functions_short) <- Settings_functions
    
    Settings_functions_list <- as.list(Settings_functions_short)
    
    reactive_workflow_names <- shiny::reactiveVal(character(0))
    selected_function <- shiny::reactiveVal(NULL)
    
    output$workflow_settings <- shiny::renderUI({
      number_of_settings <- length(Settings_functions_short)
      
      #list of custom HTML for each function
      labels <- lapply(seq_along(Settings_functions_short), function(i) {
        name <- Settings_functions_short[i]
        tagList(
          div(style = "display: flex; align-items: center;",
            shiny::actionButton(ns(paste0("workflow_del_", i)), "X", style = "margin-right: 10px;"),
            shiny::span(name, style = "flex-grow: 1;"),
            shiny::actionButton(ns(paste0("workflow_edit_", i)), "Details", style = "margin-left: auto;")
          )
        )
      })
      
      shinydashboard::box(width = 12, title = "Workflow",
        shiny::column(12, htmltools::h3("   ")),
        shiny::column(12,
          sortable::rank_list(
            text = "Drag to order",
            labels = labels,
            input_id = ns("rank_workflow_names")
          )
        )
      )
    })
    
    lapply(Settings_functions_short, function(name) {
      observeEvent(input[[paste0("function_link_", name)]], {
        selected_function(name)
      }, ignoreInit = TRUE)
    })
    
    lapply(seq_len(length(Settings_functions_short)), function(i) {
      observeEvent(input[[paste0("workflow_edit_", i)]], {
        selected_function(Settings_functions_short[i])
      }, ignoreInit = TRUE)
    })
    
    # render details
    output$selected_function_details <- shiny::renderUI({
      req(selected_function())
      function_name <- selected_function()
      function_details <- get(paste0("Settings_", function_name), envir = .GlobalEnv)
      
      htmltools::tagList(
        shiny::h4(paste("Details of", function_name)),
        shiny::verbatimTextOutput(ns("function_code"))
      )
    })
    
    # Function details
    output$function_code <- shiny::renderPrint({
      req(selected_function())
      function_name <- selected_function()
      function_details <- get(paste0("Settings_", function_name), envir = .GlobalEnv)
      settings <- function_details()
      print(settings)
    })
  })
}
