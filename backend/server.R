
library(tools)
library(plumber)
library(jsonlite)
library(streamFind)
library(plotly)
library(rsconnect)

# DEMO TODOS:
# TODO: Save stuff in sessions --> add to cache.
# TODO: Create docker containers for server and frontend --> create image

#*@filter cors
cors <- function(req, res) {

  res$setHeader("Access-Control-Allow-Origin", "*")

  if (req$REQUEST_METHOD == "OPTIONS") {
    res$setHeader("Access-Control-Allow-Methods","*")
    res$setHeader("Access-Control-Allow-Headers", req$HTTP_ACCESS_CONTROL_REQUEST_HEADERS)
    res$setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
    res$setHeader("Access-Control-Allow-Headers", "Content-Type")
    res$status <- 200
    return(list())
  } else {
    plumber::forward()
  }
}


#* @get /files_project
function() {
    filesx <- list.files(path = "/", pattern = "\\.mzML$", full.names = TRUE, recursive = FALSE)
    folders <- list.dirs(path = "/", full.names = TRUE, recursive = FALSE)
    file_names <- basename(filesx)
    folder_names <- basename(folders)
    filesandfolders <- c(file_names, folder_names)
  return(filesandfolders)
}

#* @post /open_folder
function(req) {
  folder_name <- req$body$name
  print(folder_name)
  folder_path <- paste0("/", folder_name)
  filesx <- list.files(path = folder_path, pattern = "\\.mzML$", full.names = TRUE, recursive = FALSE)
  folders <- list.dirs(path = folder_path, full.names = TRUE, recursive = FALSE)
  file_names <- basename(filesx)
  folder_names <- basename(folders)
  filesandfolders <- c(file_names, folder_names)
  return(filesandfolders)
}

#* MsData for given files by their paths
#* @post /msdata
function(req) {
  fileArray <- req$postBody
  filePaths <- fromJSON(fileArray)
  fileNames <- sapply(filePaths, function(path) basename(path))
  cache_key <- paste(sort(fileNames), collapse = "_")
  print(cache_key)
  print(filePaths)
  # Check if cached results exist for the given files
  if (file.exists(paste0(cache_key, ".rds"))) {
    # If cached results exist, load and return them
    cached_result <- readRDS(paste0(cache_key, ".rds"))
    print("loading from cache...")
    return(cache_key)
  } else {
    ms <- streamFind::MassSpecData$new(files = filePaths)
    saveRDS(ms, paste0(cache_key, ".rds"))
    print("saving cache...")
    return(cache_key)
  }
}

#* Getting details for MsData
#* @post /msdatadetails
function(req) {
  fileArray <- req$postBody
  fileNames <- fromJSON(fileArray)
  cache_key <- paste(sort(fileNames), collapse = "_")
  if (file.exists(paste0(cache_key, ".rds"))) {
    cached_result <- readRDS(paste0(cache_key, ".rds"))
    analyses <- cached_result$get_analyses()
    analysesjson <- jsonlite::serializeJSON(analyses)
    overview <- cached_result$get_overview()
    analyses_number <- cached_result$get_number_analyses()
    plot <- cached_result$plot_tic()
    plotjson <- plotly_json(plot, jsonedit = FALSE, pretty = TRUE)
    result <- list(
      overview = overview,
      analyses_number = analyses_number,
      analysesjson = analysesjson,
      plotjson = plotjson
    )
    return(result)
  } else {
    result <- list(
      error = "File not found!",
    )
 return(result)}}

#* Getting details for Mzml file
#* @post /mzmldetails
function(req) {
  fileArray <- req$postBody
  receivedData <- fromJSON(fileArray)
  fileName <- receivedData$fileName
  cache_key <- receivedData$msdata
  if (file.exists(paste0(cache_key, ".rds"))) {
    cached_result <- readRDS(paste0(cache_key, ".rds"))
    analyses <- cached_result$get_analyses(fileName)
    print(analyses)
    analysesjson <- jsonlite::serializeJSON(analyses)
    result <- list(
      analysesjson=analysesjson
    )
    return(result)
  } else {
    result <- list(
      error = "File not found!"
    )
    return(result)}}


#* Applying find_features on MsData for a given file
#* @post /find_features
function(req) {
  fileArray <- req$postBody
  fileNames <- fromJSON(fileArray)
  algo <- fileNames$algorithm
  cache_key <- fileNames$fileNames
  if (file.exists(paste0(cache_key, ".rds"))) {
    cached_result <- readRDS(paste0(cache_key, ".rds"))
    if (algo == "qPeaks") {
      gfs <- Settings_find_features_qPeaks()
    } else if (algo == "xcms3_centwave") {
      gfs <- Settings_find_features_xcms3_centwave()
    } else if (algo == "xcms3_matchedfilter") {
      gfs <- Settings_find_features_xcms3_matchedfilter()
    } else if (algo == "openms") {
      gfs <- Settings_find_features_openms()
    } else if (algo == "kpic2") {
      gfs <- Settings_find_features_kpic2()}
    updated_cache<-cached_result$find_features(gfs)
    print("applying find features...")
    saveRDS(updated_cache, paste0(cache_key, ".rds"))
    print("updating cache...")
    return(cache_key)
  } else {
    result <- list(
      error = "File not found!"
    )
    return(result)}}

#* Applying find_features on MsData with custom parameters
#* @post /custom_find_features
function(req) {
  data <- req$postBody
  datajson <- fromJSON(data)
  params<-datajson$parameters
  cache_key<-datajson$msData
  type<-datajson$data_type
  settings <- list(
    if (type=="find_features"){
      call = "find_features"}
    else{
      call = "group_features"
    },
    algorithm = "xcms3",
    parameters = xcms::CentWaveParam(
      ppm = as.numeric(params$ppm),
      peakwidth = c(as.numeric(params$minpeakwidth),as.numeric(params$maxpeakwidth)),
      snthresh = as.numeric(params$snthresh),
      prefilter = c(as.numeric(params$minprefilter),as.numeric(params$maxprefilter)),
      mzCenterFun = as.character(params$mzCenterFun),
      integrate = as.numeric(params$integrate),
      mzdiff = as.numeric(params$mzdiff),
      fitgauss = as.logical(params$fitgauss),
      noise = as.numeric(params$noise),
      verboseColumns = as.logical(params$verboseColumns),
      roiList = list(),
      firstBaselineCheck = as.logical(params$firstBaselineCheck),
      roiScales = numeric(),
      extendLengthMSW = as.logical(params$extendLengthMSW)
    ))
  print(settings)
  if (file.exists(paste0(cache_key, ".rds"))) {
    if(type == "find_features"){
    cached_result <- readRDS(paste0(cache_key, ".rds"))
    updated_cache<-cached_result$find_features(settings)
    print("applying find features...")
    saveRDS(updated_cache, paste0(cache_key, ".rds"))
    print("updating cache...")}
    else if(type == "group_features"){
      cached_result <- readRDS(paste0(cache_key, ".rds"))
      updated_cache<-cached_result$group_features(settings)
      print("applying group features...")
      saveRDS(updated_cache, paste0(cache_key, ".rds"))
      print("updating cache...")}
    return(cache_key)
  } else {
    result <- list(
      error = "File not found!"
    )
return(result)}}


#* Applying group_features on MsData for a given file
#* @post /group_features
function(req) {
  fileArray <- req$postBody
  fileNames <- fromJSON(fileArray)
  algo <- fileNames$algorithm
  cache_key <- fileNames$fileNames
  if (file.exists(paste0(cache_key, ".rds"))) {
    cached_result <- readRDS(paste0(cache_key, ".rds"))
    if (algo == "xcms3_peakdensity") {
      gfs <- Settings_group_features_xcms3_peakdensity()
    } else if (algo == "xcms3_peakdensity_peakgroups") {
      gfs <- Settings_group_features_xcms3_peakdensity_peakgroups()
    }
    print(gfs)
    updated_cache<-cached_result$group_features(gfs)
    print(updated_cache)
    print("grouping features...")
    saveRDS(updated_cache, paste0(cache_key, ".rds"))
    print("updating cache...")
    return(cache_key)
  } else {
    result <- list(
      error = "File not found!"
    )
    return(result)}}

