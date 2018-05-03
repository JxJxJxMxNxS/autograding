require_relative "./my_model"

RSpec.describe MyModel do
 it "expect be true" do
   a=MyModel.new.the_truth
   expect(a).to be == true
 end

 it "expect be 2" do
   a=MyModel.new.dos
   expect(a).to be == 2
 end
end
