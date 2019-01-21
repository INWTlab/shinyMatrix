jsonToMatrix <- function(x, coerce = as.character){
  if (isEmpty(x$data) && isEmpty(x$colnames) && isEmpty(x$rownames)) return(matrix(coerce(NA), 0, 0))
  if (isEmpty(x$data) && !isEmpty(x$colnames) && isEmpty(x$rownames)){
    m <- matrix(coerce(NA), 0, length(x$colnames))
    colnames(m) <- x$colnames
    return(m)
  }
  if (isEmpty(x$data) && isEmpty(x$colnames) && !isEmpty(x$rownames)){
    m <- matrix(coerce(NA), length(x$rownames), 0)
    rownames(m) <- x$rownames
    return(m)
  }
  if (isEmpty(x$data) && !isEmpty(x$colnames) && !isEmpty(x$rownames)){
    m <- matrix(coerce(NA), length(x$rownames), length(x$colnames))
    colnames(m) <- x$colnames
    rownames(m) <- x$rownames
    return(m)
  }

  m <- do.call("rbind", lapply(x$data, function(row) coerce(unlist(row))))

  if (!isEmpty(x$colnames)) colnames(m) <- x$colnames
  if (!isEmpty(x$rownames)) rownames(m) <- x$rownames

  m
}

isEmpty <- function(x){
  is.null(x) || length(x) == 0
}
