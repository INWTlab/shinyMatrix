################################################################################
# This script is a template for the general structure of R scripts. This first #
# header should describe what the script does, which input files it needs and  #
# which output it produces. This header also contains name and e-mail adress   #
# of the author.                                                               #
#                                                                              #
# Author: Mira Céline Klein                                                    #
# E-mail: mira.klein@inwt-statistic.de                                         #
################################################################################


# 00 Preparation ---------------------------------------------------------------

# Remove nonstandard packages
INWTUtils::rmPkgs()

# Empty workspace
rm(list = ls(all.names = TRUE))

# Load packages
library(INWTUtils)

# Define global variables
A_GLOBAL_VARIABLE <- 4 # Upper case and underlines for global variables


# 01a Load data ----------------------------------------------------------------

exampleVector <- c(1:3) # lowerCamelCase for ordinary object names


# 01b Prepare data -------------------------------------------------------------



# 02 ... -----------------------------------------------------------------------
