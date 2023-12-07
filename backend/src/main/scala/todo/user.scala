package todo

import java.util.Date
import cats.data.Validated
import cats.data.ValidatedNec
import cats.implicits._

case class User(
    userName: UserName,
    password: Password,
    email: Email,
    status: Status = Status.SetupRequired,
    role: Role = Role.User,
    createdAt: FutureDate = FutureDate.now,
    failedLoginAttempts: PosInt = PosInt.zero
):
  val modifiedAt = Date()

object User:
  def fromRawInput(
      user: String,
      pw: String,
      mail: String
  ): ValidationResult[User] =
    (UserName(user), Password(pw), Email(mail)).mapN(User(_, _, _))

enum Status:
  case SetupRequired, SetupComplete

enum Role:
  case User, Admin

opaque type UserName = String
opaque type Password = String
opaque type FutureDate = Date
opaque type Email = String
opaque type PosInt = BigInt
type ValidationResult[A] = ValidatedNec[String, A]

object FutureDate:
  def apply(rawDate: Date): ValidationResult[FutureDate] =
    if (now.before(rawDate)) rawDate.validNec
    else
      s"You supplied ${rawDate} which needs to be larger or equal than today".invalidNec
  def now: FutureDate =
    Date()

object Email:
  def apply(rawInput: String): ValidationResult[Email] =
    if (isValid(rawInput)) rawInput.validNec
    else "The email pattern is invalid".invalidNec

  private val pattern = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$".r
  private def isValid(rawInput: String): Boolean =
    pattern.matches(rawInput)

object Password:
  private val minLength = 8
  private val hasUpper = "[A-Z]".r
  private val hasLower = "[a-z]".r
  private val hasNumber = "[0-9]".r
  private val hasSpecial = "[^A-Za-z0-9]".r

  def apply(rawInput: String): ValidationResult[Password] =
    (
      validateLength(rawInput),
      validateUpper(rawInput),
      validateLower(rawInput),
      validateNumber(rawInput),
      validateSpecial(rawInput)
    ).mapN((_, _, _, _, _) => rawInput)

  private def validateLength(input: String): ValidationResult[Password] =
    if (input.length >= minLength) input.validNec
    else "Password must be at least 8 characters long".invalidNec

  private def validateUpper(input: String): ValidationResult[Password] =
    if (hasUpper.matches(input)) input.validNec
    else
      "Password must be at contain at least 1 upper case character".invalidNec

  private def validateLower(input: String): ValidationResult[Password] =
    if (hasLower.matches(input)) input.validNec
    else
      "Password must be at contain at least 1 lower case character".invalidNec

  private def validateNumber(input: String): ValidationResult[Password] =
    if (hasNumber.matches(input)) input.validNec
    else "Password must be at contain at least 1 number".invalidNec

  private def validateSpecial(input: String): ValidationResult[Password] =
    if (hasSpecial.matches(input)) input.validNec
    else "Password must be at contain at least 1 special character".invalidNec

object UserName:
  def apply(rawInput: String): ValidationResult[UserName] =
    rawInput.validNec

object PosInt:
  def apply(rawNum: BigInt): ValidationResult[PosInt] =
    if (rawNum >= 0) rawNum.validNec
    else
      "A negative integer was given where a non-negative integer is required.".invalidNec

  inline def zero: PosInt = 0
  inline def one: PosInt = 1
  inline infix def `+`(x: PosInt, y: PosInt): PosInt = x + y
  inline infix def `*`(x: PosInt, y: PosInt): PosInt = x * y
