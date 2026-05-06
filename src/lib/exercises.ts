import { supabase } from '../lib/supabase'
import type { PostgrestError } from '@supabase/supabase-js'
import type { WorkoutLog } from '../types/workout'

export async function createWorkoutLog(userId: string, date: string, notes: string)
: Promise<{ data: WorkoutLog[] | null; error: PostgrestError | null  }> {
    const { data, error } = await supabase
        .from('simple_workout_log')
        .insert({
            user_id: userId,
            date,
            notes
        })
        .select()
        .returns<WorkoutLog[]>()
    return { data, error }
}

export async function getWorkoutLogs(userId: string)
: Promise<{ data: WorkoutLog[] | null; error: PostgrestError | null  }> {
    const { data, error } = await supabase
        .from('simple_workout_log')
        .select('*')
        .eq('user_id', userId)
        .returns<WorkoutLog[]>()
    return { data, error }
}

export async function updateWorkoutLog(id: string, date: string, notes: string): Promise<{ error: PostgrestError | null  }> {
    const { error } = await supabase
        .from('simple_workout_log')
        .update({ date, notes })
        .eq('id', id)
    return { error }
}

export async function deleteWorkoutLog(id: string)
: Promise<{ error: PostgrestError | null }> {   
    const { error } = await supabase
        .from('simple_workout_log')
        .delete()
        .eq('id', id)
    
    return { error }
}


