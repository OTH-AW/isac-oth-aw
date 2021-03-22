class ColumnDescriptor:
    def __init__(self, value, unit, description, old_value):
        self.value = value
        self.unit = unit
        self.description = description
        self.old_value = old_value
        pass
        
    def __str__(self):
        return "Value: {0} | Description: {1} | Old-Value: {2}".format(
            self.value, self.description, self.old_value)