################################################################################
# This script checks the code in a project for deviations from the style       #
# rules. This replaces the test via expect_lint_free which does currently not  #
# work in the R CMD check. The following files are testes:                     #
# - Files in the R folder and the test folder of the package                   #
# - Files in the script folder                                                 #
# - Code from .Rmd reports is extracted and tested as well                     #
#   Remark: This code needs to be corrected of course in the original Rmd file #
#   and not in the R file created via purl by this script!                     #
#                                                                              #
# Author: Mira Céline Klein                                                    #
# E-mail: mira.klein@inwt-statistic.de                                         #
################################################################################

library(dplyr)
library(INWTUtils)
library(knitr)

# Adjust paths here, don't forget the / in the end
SCRIPT_DIR <- "RScripts/"
REPORT_DIR <- "reports/"
PKG_DIR <- "./"
PATH_PURL_FILES <- "purlFiles/"


# 01 Extract R code from Rmd files ---------------------------------------------

# List Rmd files
rmdFiles <- list.files(REPORT_DIR,
                       pattern = "*.Rmd$",
                       full.names = TRUE,
                       recursive = TRUE)

# Create directory for code from Rmd files
pathPurlExists <- dir.exists(PATH_PURL_FILES)
if (!pathPurlExists) dir.create(PATH_PURL_FILES)

# Extract code from Rmd files and save it
lapply(rmdFiles,
       function(file) {
         purl(input = file,
              output = paste0(PATH_PURL_FILES,
                              gsub(".Rmd", ".R", basename(file))),
              documentation = 0L)
       })


# 02 List all R files to check -------------------------------------------------

# You can insert additional directories here:
scriptFiles <- lapply(list(scripts = SCRIPT_DIR,
                           pkgTests = paste0(PKG_DIR, "tests"),
                           Rmd = PATH_PURL_FILES),
                      list.files,
                      pattern = "*.R$",
                      full.names = TRUE,
                      recursive = TRUE) %>%
  unlist %>% unname

pkgFiles <- list.files(paste0(PKG_DIR, "R"),
                       pattern = "*.R$",
                       full.names = TRUE,
                       recursive = TRUE)


# 03 Check files for style rule deviations -------------------------------------
# Execute each line separately!
checkStyle(pkgFiles, type = "pkgFuns")
checkStyle(scriptFiles, type = "script")


# 04 Remove code extracted from Rmd files --------------------------------------

# Remove files
lapply(paste0(PATH_PURL_FILES, gsub(".Rmd", ".R", basename(rmdFiles))),
       unlink)

# Remove folder for purl files if it did not exist before
if (!pathPurlExists) unlink(PATH_PURL_FILES, recursive = TRUE)
