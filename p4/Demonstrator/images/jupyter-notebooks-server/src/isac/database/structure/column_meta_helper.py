from isac.database.structure.column_descriptor import ColumnDescriptor

class ColumnMetaHelper:
    def __init__(self):
        self.descriptors = []
        self.push(ColumnDescriptor("time", "s", "Zeitpunkt", "@time"))
        self.push(ColumnDescriptor("x_pos_actual_f10", "mm", "Programmierte Position in X-Richtung, Istwert in mm", "@f10"))
        self.push(ColumnDescriptor("y_pos_actual_f12", "mm", "Programmierte Position in Y-Richtung, Istwert in mm", "@f12"))
        self.push(ColumnDescriptor("z_pos_actual_f8", "mm", "Programmierte Position in Z-Richtung, Istwert in mm", "@f8"))
        self.push(ColumnDescriptor("interpolation_feedrate_actual_f6", "mm/min", "Interpolationsvorschub, Istwert in mm/min", "@f6"))
        self.push(ColumnDescriptor("spindle_speed_actual_f3", "RPM", "Spindeldrehzahl, Istwert in RPM", "@f3"))
        self.push(ColumnDescriptor("torque_set_f11", "Nm", "Antriebsmomentensollwert in Nm", "@f11"))
        self.push(ColumnDescriptor("spindle_power_f9", "W", "Antriebswirkleistung Hauptspindel in W", "@f9"))
        self.push(ColumnDescriptor("x_pos_set_f2", "mm", "Programmierte Position in X-Richtung, Sollwert in mm", "@f2"))
        self.push(ColumnDescriptor("y_pos_set_f4", "mm", "Programmierte Position in Y-Richtung, Sollwert in mm", "@f4"))
        self.push(ColumnDescriptor("z_pos_set_f5", "mm", "Programmierte Position in Z-Richtung, Sollwert in mm", "@f5"))
        self.push(ColumnDescriptor("interpolation_feedrate_set_f7", "mm/min", "Interpolationsvorschub, Sollwert in mm/min", "@f7"))
        self.push(ColumnDescriptor("wks_set_f1", "-", "WKS-Sollwert inkl Überlagerungsanteile", "@f1"))
        pass
    
    def push(self, columnDescriptor):
        self.descriptors.append(columnDescriptor)
        pass
    
    def getTranslations(self):
        namedColumns = dict()
        for d in self.descriptors:
            namedColumns[d.old_value] = d.value
            pass
        return namedColumns