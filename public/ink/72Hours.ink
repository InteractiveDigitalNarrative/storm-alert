// 72 HOURS - Disaster Management Game
// ACT 1: THE NIGHT

// === VARIABLES ===
VAR temperature = -18

VAR action_slots_used = 0
VAR action_slots_max = 4

// Preparation items
VAR has_torch = false
VAR has_water = false
VAR has_stove = false
VAR has_firewood = false
VAR has_medication = false
VAR has_radio = false
VAR has_emergency_numbers = false
VAR has_gate_release = false


// === STORY START ===
# AUDIOLOOP: ../Sound/wind.wav
# CLASS: tv-scene
# BACKGROUND: https://images.unsplash.com/photo-1552858725-2758b5fb1286?w=800
* [⚠ BREAKING NEWS]
    -> tv_news

=== tv_news ===

# CLEAR
# CLASS: tv-scene

  Severe storm warning for coastal Estonia.

  Wind speeds up to 120 km/h expected tonight.

  Storm arrives at 22:00.

* [Continue]
     -> living_room


=== living_room ===

# CLEAR
# CLASS: fade-in-scene
# CLASS: room-lit
# BACKGROUND: ../Images/Room.jpg

<i>[Your living room. Evening.]</i>

Your grandmother is asleep in her room.

Her blood pressure medication is on the kitchen counter.

A text appear on your mobile...

* [Check text]
      -> check_text

=== check_text ===
#CLEAR
Martin: "Power's going to be out for days.

  Water. Light. Heat. Meds.

  Check everything NOW."
* [Check time]
    -> check_time
=== check_time ===

# CLEAR

* [20:00]
    -> hurry
=== hurry ===
#CLEAR
You realize that you don't have enough time to prepare for everything. You can only choose 3-5 actions at most...
* [Start Preparation]
    -> preparation_intro 

=== preparation_intro ===

# CLEAR

You mentally go through what needs to be done...

* [Think of actions]
    -> preparation_phase
    
=== preparation_phase ===

  Actions Chosen {action_slots_used} of 4

  + {not has_torch} [🔦 Collect batteries for torch]
      ~ has_torch = true
      ~ action_slots_used++
      You check the torch. Fresh batteries. Good.
      -> next_action

  + {not has_water} [💧 Fill bottles with tap water]
      ~ has_water = true
      ~ action_slots_used++
      You fill several bottles. Heavy to carry, but essential.
      -> next_action

  + {not has_stove} [🔥 Check the wood stove works]
      ~ has_stove = true
      ~ action_slots_used++
      The old wood stove in the corner. You haven't used it in years. You check the flue, clear the ash. It works.
      -> next_action

  + {not has_firewood} [🪵 Bring extra firewood inside]
      ~ has_firewood = true
      ~ action_slots_used++
      You haul armload after armload from the shed. Your back protests, but now you have enough for days.
      -> next_action

  + {not has_medication} [💊 Check you have grandmother's medication supply]
      ~ has_medication = true
      ~ action_slots_used++
      You check Helgi's medication. Five days left. That should be enough... you hope.
      -> next_action

  + {not has_radio} [📻 Find the battery-powered radio]
      ~ has_radio = true
      ~ action_slots_used++
      You dig through the closet and find the old radio. You test it. Static, then a station. It works.
      -> next_action

  + {not has_emergency_numbers} [📝 Write down emergency numbers]
      ~ has_emergency_numbers = true
      ~ action_slots_used++
      You copy the emergency numbers from the fridge magnet onto paper. Phone batteries don't last forever.
      -> next_action

  + {not has_gate_release} [🔧 Check the manual release on the front gate]
      ~ has_gate_release = true
      ~ action_slots_used++
      The electric gate won't work without power. You test the manual release mechanism. Stiff, but functional.
      -> next_action

  === next_action ===

  {action_slots_used < 4:
      -> preparation_phase
  - else:                                                        
      * [Continue]                                               
          -> preparation_complete
  }

=== preparation_complete ===

  # CLEAR

  You've done what you can. 

  The storm will be here in less than an hour.

  Time to rest before it hits.


* [Sleep]
    -> blackout

=== blackout ===
# AUDIOLOOP:
# CLEAR
# CLASS: blackout-scene
# BACKGROUND:

<div class="blackout-overlay"></div>

<i>Sound: Silence. Then a click. The hum of electronics stopping.</i>

<i>[Beat of darkness]</i>

* [Wake up]
    -> wake_up

=== wake_up ===

# CLEAR
# CLASS: fade-in-scene
# CLASS: room-dark
# BACKGROUND: ../Images/Room.jpg
# AUDIOLOOP: ../Sound/wind.wav

You wake up.

* [Look at the time]
    -> check_time_again

=== check_time_again ===
#CLEAR
3:47 AM

* [Turn on the light]
    -> turn_on_light

=== turn_on_light ===
#CLEAR
It is not working!

The power is out.

-> END
