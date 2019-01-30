context("Convert JSON to matrix")

test_that("no data", {
  # 0x0
  x <- list()
  expect_equal(jsonToMatrix(x), matrix(NA_character_, 0, 0))

  # 0x3
  x <- list(
    colnames = letters[1:3]
  )
  m <- matrix(NA_character_, 0, 3)
  colnames(m) <- letters[1:3]
  expect_equal(jsonToMatrix(x), m)

  # 3x0
  x <- list(
    rownames = 1:3
  )
  m <- matrix(NA_character_, 3, 0)
  rownames(m) <- 1:3
  expect_equal(jsonToMatrix(x), m)

  # 3x3
  x <- list(
    colnames = letters[1:3],
    rownames = 1:3
  )
  m <- matrix(NA_character_, 3, 3)
  colnames(m) <- letters[1:3]
  rownames(m) <- 1:3
  expect_equal(jsonToMatrix(x), m)
})

test_that("single row", {
  x <- list(
    data = list(
      list("a", "b", "c")
    )
  )
  expect_equal(jsonToMatrix(x), matrix(letters[1:3], 1, 3))
})

test_that("single column", {
  x <- list(
    data = list(
      list("a"),
      list("b"),
      list("c")
    )
  )
  expect_equal(jsonToMatrix(x), matrix(letters[1:3], 3, 1))
})

test_that("coercion", {
  x <- list(
    data = list(
      list("1", "2", 3),
      list(4, "5", "6")
    )
  )
  expect_equal(jsonToMatrix(x), matrix(as.character(1:6), 2, 3, byrow = TRUE))
  expect_equal(jsonToMatrix(x, as.numeric), matrix(1:6, 2, 3, byrow = TRUE))
})
