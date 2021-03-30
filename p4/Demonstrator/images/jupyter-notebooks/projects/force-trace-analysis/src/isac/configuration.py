# Verwendetes Projekt, besteht immer aus: ISAC_ + Projektname
project_database = 'ISAC_' + 'KONV_1_2'

# Collections in einer Datenbank
class collections:
    cleaned = 'Cleaned_Trace_Data'
    force_import = 'Force_Import'

# Reihenfolge der importierten Spalten aus den Maschinendaten
order = ['time',
         'wks_set_f1',
         'x_pos_actual_f10',
         'torque_set_f11',
         'y_pos_actual_f12',
         'x_pos_set_f2',
         'spindle_speed_actual_f3',
         'y_pos_set_f4',
         'z_pos_set_f5',
         'interpolation_feedrate_actual_f6',
         'interpolation_feedrate_set_f7',
         'z_pos_actual_f8',
         'spindle_power_f9',
        ]