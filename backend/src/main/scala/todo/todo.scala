package todo

import cats._
import cats.data.NonEmptyList
import cats.syntax.all._
import math.Ordered.orderingToOrdered
import monocle.syntax.all._
import monocle.Lens
import java.time.LocalDateTime
import java.time.Duration

case class ResourceType(name: String, owner: User, description: Option[String])
case class Resource(
    name: String,
    owner: User,
    types: NonEmptyList[ResourceType],
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
      resources: Option[NonEmptyList[Resource]] = None,
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

object TaskCreation:
  import Task._
  extension (user: User)
    def createAspect(name: String, description: Option[String] = None): Aspect =
      Aspect(TaskDetail(name = name, owner = user, description = description))

    def createResourceType(
        name: String,
        description: Option[String] = None
    ): ResourceType =
      ResourceType(name, user, description)

  extension (resourceType: ResourceType)
    def createResource(
        name: String,
        others: Option[NonEmptyList[ResourceType]],
        desc: Option[String] = None
    ): Resource =
      val types = others match
        case None        => NonEmptyList.one(resourceType)
        case Some(other) => resourceType :: other

      val user = resourceType.owner
      Resource(name, user, types, desc)

  extension (aspect: Aspect)
    def createMilestone(
        name: String,
        preferredFinishDate: Option[FutureDate] = None,
        description: Option[String] = None
    ): Milestone =
      val owner = aspect.detail.owner
      val detail = TaskDetail(
        name = name,
        owner = owner,
        preferredFinishDate = preferredFinishDate,
        description = description
      )
      Milestone(detail, aspect)
  extension (milestone: Milestone)
    def createTodo(
        name: String,
        minimumLength: NonNegInt,
        timeEstimateMin: Option[NonNegInt] = None,
        preferredFinishDate: Option[FutureDate] = None,
        resources: Option[NonEmptyList[Resource]] = None,
        description: Option[String] = None
    ): Todo =
      val owner = milestone.detail.owner
      val detail = TaskDetail(
        name = name,
        owner = owner,
        timeEstimateMin = timeEstimateMin,
        description = description
      )
      Todo(detail, milestone, minimumLength, resources)

object TaskModification:
  import Task._
  private inline def timeSpent =
    Lens[TaskDetail, NonNegInt](_.timeSpent)(n => t => t.copy(timeSpent = n))
  private inline def isFinished =
    Lens[TaskDetail, Boolean](_.isFinished)(b => t => t.copy(isFinished = b))
  private inline def name =
    Lens[TaskDetail, String](_.name)(n => t => t.copy(name = n))
  private inline def timeEstimateMin =
    Lens[TaskDetail, Option[NonNegInt]](_.timeEstimateMin)(n =>
      t => t.copy(timeEstimateMin = n)
    )
  private inline def todoTaskDetail =
    Lens[Todo, TaskDetail](_.detail)(td => t => t.copy(td))

  extension (todo: Todo)
    inline def changeTaskName(newName: String): Todo =
      todoTaskDetail.andThen(name).replace(newName)(todo)
