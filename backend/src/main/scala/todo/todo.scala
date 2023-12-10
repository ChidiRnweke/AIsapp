package todo

import cats._
import cats.data.NonEmptyList
import cats.syntax.all._
import math.Ordered.orderingToOrdered

import java.time.LocalDateTime
import java.time.Duration

case class ResourceType(name: String, owner: User, description: Option[String])
case class Resource(
    name: String,
    owner: User,
    types: List[ResourceType],
    description: Option[String]
)

case class TaskDetail(
    name: String,
    owner: User,
    timeSpent: NonNegInt = NonNegInt.zero,
    timeEstimateMin: Option[NonNegInt] = None,
    isFinished: Boolean = false,
    preferredFinishDate: Option[FutureDate] = None,
    description: Option[String] = None
)

enum Task(
    detail: TaskDetail,
    createdAt: FutureDate,
    modifiedAt: FutureDate = FutureDate.now()
):
  case Todo(
      detail: TaskDetail,
      milestone: Milestone,
      minimumLength: NonNegInt,
      resources: Option[NonEmptyList[Resource]],
      createdAt: FutureDate = FutureDate.now()
  ) extends Task(detail, createdAt)

  case Milestone(
      detail: TaskDetail,
      aspect: Aspect,
      createdAt: FutureDate = FutureDate.now()
  ) extends Task(detail, createdAt)

  case Aspect(detail: TaskDetail, createdAt: FutureDate = FutureDate.now())
      extends Task(detail, createdAt)

case class TimeSlotDetails(
    startTime: FutureDateTime,
    duration: Duration,
    owner: User,
    tasks: Option[NonEmptyList[Task]]
)

enum TimeSlot(id: String, details: TimeSlotDetails):
  private case AvailableTimeSlot(id: String, details: TimeSlotDetails)
      extends TimeSlot(id, details)
  private case UnavailableTimeSlot(id: String, details: TimeSlotDetails)
      extends TimeSlot(id, details)

object TimeSlot:
  private val minimumDuration = Duration.ofMinutes(30)
  def apply(id: String, details: TimeSlotDetails): TimeSlot =
    if (details.duration < minimumDuration) UnavailableTimeSlot(id, details)
    else AvailableTimeSlot(id, details)
