# Asapp: another scheduling and agenda app

## Aspect hierarchy:

Things you want do to do are organised in the following hierarchy:
1. Aspect: can be spare time, work, health, ... 
2. Committment: what do you want to do / achieve in the long run?
3. Milestone
4. Task

Essentially you start by defining an aspect, within this aspect you can define several committments.
These committments can each hold one or more milestones. Tasks can have other tasks as a dependency. 
You should also be be able to indicate how long a task would take, but that is optional.

---
## Schedule:

###  Time allocation

Here you indicate how much time you want to spend. You can define this on whatever level you want:

1. Time in general
2. Time per aspect
3. Time per milestone
4. Time per task
   

### Time budgets
Dates matter, you generally indicate in advance how much time you want to spend

1. On a day level
2. On a weekday
3. On a weekend

Concretely we'd need to make a day, week, month and year objects. Time can be allocated to any of these. There needs to be the possibility to double check if they're aligned, we should be able to see if or less time is allocated between these objects and the ones lower in the hierarchy. 

We can also define a mapping between these objects and aspects, milestones and tasks. We can use a dynamic list to do this or maybe something like a map.

Implementation idea: start by being able to create a day. After that, make a week object that can create 7 days and store them. After that a month that creates 4 weeks and finally a year that takes 12 months. 

----

> 26/01/2022 done until here

### Scheduler

The scheduler has several modes, it takes all of the above into account and then allocates specific tasks to specific days. Several allocation modes should be possible.

Will need to extend the  aspects. You need to be able to allocate how much time you want to spend per aspect per week or month on average. The scheduler takes in this infomation and computes the ratio's of how time should be spent. As a user you can obviously go into certain days and alter them.

Afterwards the scheduler takes into account this information and starts putting tasks into the calendar. It takes into account: dependencies between tasks and the ratios of the aspects. 

Consideration: Objects with a preferredFinish that is soon need to be dealt with ASAP.

I propose the following scheduling modes:

#### Highest ratio first (HRF): 
Return the objects with a preferredFinish > 7 days in all aspects, schedule these first.

1. Go to the aspect with the highest weight
2. Find tasks without a dependency
3. Sort by preferredFinish
4. Find indices of days that have enough space for it to be scheduled there
5. Allocate at random
6. Repeat 2 to 5 until the allocation for that aspect is over
7. Return to 1
8. (optional) Stop when allocation for that week is 80 %, then select tasks at random from all tasks that don't have a dependency.







### Gamification

Rough idea: hitting targets / streaks should reward you with useless reward points. This is an idea that really be expanded on later. Just need the basic logic to be there

## Flutter!